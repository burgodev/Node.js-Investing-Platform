import { Transaction, TransactionType } from "@prisma/client";
import { totalmem } from "os";
import { TransactionRepository } from "../../repositories/transaction-repository";
import UserRepository from "../../repositories/user-repository";

class DashboardService {

    private transactionRepository: TransactionRepository;
    private userRepository: UserRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.userRepository = new UserRepository();
    }

    public async percentualGainPerMonthHistory(user_id: string) {
        const take = 12;
        const skip = 0;
        const order_by = null;
        const order_type = null;
        const type_enum = TransactionType.GAIN;

        const paginated_transactions = await this.transactionRepository.listFromUser(
            user_id, take, skip, order_by, order_type, type_enum
        );

        const data = paginated_transactions.list.map(transaction => {
            return {
                month: transaction.gain_month,
                year: transaction.gain_year,
                percentual_liquid_profit: transaction.percentual_liquid_profit
            }
        });

        return data;
    }

    public async getUserData(user_id: string) {
        const transactions = await this.transactionRepository.listAllGains(user_id);
        const liquid_profit = this.sumAllGains(transactions);

        const user = await this.userRepository.getByIdJoinContract(user_id);

        const data = {
            balance: user.balance?.toFixed(2),
            
            available_for_withdraw_balance: user.available_for_withdraw_balance | 0,
            contract_started_at: user.contract.started_at,
            contract_expires_at: user.contract.expires_at,
            contract_period: user.contract.period,
            liquid_profit: liquid_profit?.toFixed(2)
        }

        return data;
    }

    private sumAllGains(transactions: Transaction[]): number {
        let total = 0;

        transactions.forEach(transaction => {
            total += transaction.balance;
        });

        return total;
    }

}

export default DashboardService;