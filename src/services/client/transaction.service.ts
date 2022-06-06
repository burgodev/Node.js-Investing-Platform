import { Prisma, Transaction, TransactionType } from "@prisma/client";
import { use } from "i18next";
import ValidationError from "../../errors/validation-error";
import { convertToEnum, l } from "../../helpers/general";
import { TransactionRepository } from "../../repositories/transaction-repository";
import UserRepository from "../../repositories/user-repository";
import { Paginate } from "../../types/common";

class TransactionService {
    private repository: TransactionRepository;
    private userRepository: UserRepository;
    private admin_user_id = '94bdbf45-a691-48bc-932b-fabe6fdef926';

    constructor() {
        this.repository = new TransactionRepository();
        this.userRepository = new UserRepository();
    }

    public async list(
        user_id: string,
        take: number,
        skip: number,
        order_by: string,
        order_type: string,
        type: string
    ): Promise<any> {
        const type_enum = type ? convertToEnum<TransactionType>(type, TransactionType) : null;
        const paginated_transactions = await this.repository.listFromUser(user_id, take, skip, order_by, order_type, type_enum);

        const formatted_transactions = paginated_transactions.list.map(transaction => {
            return {
                ...transaction,
                balance: transaction.balance?.toFixed(2),
                user_balance_before_transaction: transaction.user_balance_before_transaction?.toFixed(2),
                type: this.formatTransactionType(transaction.type)
            }
        });

        const data = {
            ...paginated_transactions,
            list: formatted_transactions
        }

        return data;
    }

    public async withdraw(user_id: string, amount: number): Promise<Transaction> {
        const user = await this.userRepository.getByIdJoinContract(user_id);

        if (!user.contract.is_expired) {

            if (user.balance_available_for_withdraw === null) {
                throw new ValidationError("Erro interno. Não foi possível calcular o saldo disponível para saque, contate o suporte.");
            }
    
            if (user.balance_available_for_withdraw < amount) {
                throw new ValidationError(`Você não tem saldo disponível para saque suficiente! 
                    Saldo disponível: ${user.balance_available_for_withdraw},
                    Saque Solicitado: ${amount}`);
            }

        } else if (user.balance < amount) {
            throw new ValidationError(`Você não tem saldo disponível para saque suficiente! 
                Saldo disponível: ${user.balance},
                Saque Solicitado: ${amount}`);
        }

        const transaction =  await this.repository.create({
            balance: amount,
            type: TransactionType.WITHDRAW,
            user: {
                connect: {
                    id: user_id,
                },
            },
        });

        const updated_user = await this.userRepository.decreaseBalanceAndAvailableBalance(user_id, amount);

        const data = {
            ...transaction,
            user_new_balance: updated_user.balance
        }

        return data;
    }

    public async gain(user_id: string, profit: number, year: number, month: number) {
        const user = await this.userRepository.getByIdJoinContract(user_id);

        if (!user) { throw new ValidationError("Não foi possível encontrar o cliente informado!"); }
        if (!user.is_active) { throw new ValidationError("Este cliente está desativado!"); }
        if (!user.contract) { throw new ValidationError("Esse usuário não possui contratos ativos!"); }

        const period = user.contract.period;

        const gains = this.calculateClientAndAdminGain(period, user.balance, profit);

        const transaction_data = await this.createGainTransactionAndUpdateUserBalance(
            user.id, 
            gains.client_gain, 
            year,
            month,
            user.balance,
            profit,
            gains.client_percentage
        );
        //await this.createGainTransactionAndUpdateUserBalance(this.admin_user_id, gains.admin_gain, year, month);

        const formatted_transaction = {
            ...transaction_data,
            balance: transaction_data.balance.toFixed(2),
            new_balance: transaction_data.balance.toFixed(2),
            new_balance_available_for_withdraw: transaction_data.new_balance_available_for_withdraw.toFixed(2),
            user_balance_before_transaction: transaction_data.user_balance_before_transaction.toFixed(2)
        }

        return formatted_transaction;
    }

    private async createGainTransactionAndUpdateUserBalance(user_id: string, 
        gain: number, 
        year: number, 
        month: number, 
        user_balance_before_transaction: number,
        raw_profit: number,
        client_percentage: number
    ) {
        const transaction: Prisma.TransactionCreateInput = {
            balance: gain,
            type: TransactionType.GAIN,
            gain_month: month,
            gain_year: year,
            user_balance_before_transaction,
            percentual_raw_profit: raw_profit,
            percentual_liquid_profit: client_percentage,
            user: {
                connect: {
                    id: user_id
                }
            }
        };

        const transaction_data = await this.repository.create(transaction);

        const user = await this.userRepository.increaseGainBalance(user_id, gain);

        const ret = {
            ...transaction_data,
            new_balance: user.balance,
            new_balance_available_for_withdraw: user.balance_available_for_withdraw,
            percentual_liquid_profit: 1,
            percentual_raw_profit: 1

        }

        return ret;
    }

    private calculateClientAndAdminGain(period: number, user_balance: number, percentage_profit: number): IClientAdminGain {
        let client_percentage = 0;

        if (period === 12) {
            client_percentage = 0.5;
        } else if (period === 18) {
            client_percentage = 0.55;
        } else if (period === 24) {
            client_percentage = 0.6;
        } else {
            throw new ValidationError(`Não é possível calcular o ganho do usuário. 
            Para o período de contrato desse usuário (diferente de 12, 18, 24 meses) não está programada a porcentagem de comissão do admin.
            Contate o suporte do sistema!`);
        }
        
        const total_profit = user_balance * (percentage_profit/100);
        const client_gain = total_profit * client_percentage;
        const admin_gain = total_profit - client_gain;
        
        const admin_percentage = 1 - client_percentage;
        const admin_liquid_percentage = (percentage_profit * admin_percentage);
        const client_liquid_percentage = (percentage_profit * client_percentage);

        l.debug(`gain formula ${client_gain} = ${user_balance} * (${percentage_profit}/100) * ${client_percentage}`);
        
        const gains = {
            admin_gain,
            client_gain,
            admin_percentage: admin_liquid_percentage,
            client_percentage: client_liquid_percentage
        }

        return gains;
    }

    private formatTransactionType(type: TransactionType): string {
        if (type === TransactionType.GAIN) {
            return "rendimento";
        } else if (type === TransactionType.DEPOSIT) {
            return "depósito";
        } else if (type === TransactionType.WITHDRAW) {
            return "saque";
        }

        return "-"
    }

    
}

interface IClientAdminGain {
    client_gain: number,
    admin_gain: number,
    admin_percentage: number,
    client_percentage: number
}

export default TransactionService;
