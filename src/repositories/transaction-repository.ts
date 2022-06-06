import { Prisma, Transaction, TransactionType } from "@prisma/client";
import { Paginate } from "../types/common";
import BaseRepository from "./base-repository";

class TransactionRepository extends BaseRepository {
    
    protected select_arguments = {
        user_id: true,
        balance: true,
        type: true,
        created_at: true,
        gain_month: true,
        gain_year: true,
        user_balance_before_transaction: true,
        percentual_raw_profit: true,
        percentual_liquid_profit: true
    };

    constructor() {
        super();
        this.setClient(this.prisma.transaction);
    }

    public async create(transaction: Prisma.TransactionCreateInput) {
        return await this.client.create({
            data: transaction,
            select: this.select_arguments,
        });
    }

    public async listFromUser(
        user_id: string,
        take: number,
        skip: number,
        order_by: string,
        order_type: string,
        type: TransactionType
    ): Promise<Paginate<Transaction>> {
        const where: Prisma.TransactionWhereInput = {
            user_id,
        };

        if (type != null) {
            where.type = type;
        }

        return await this.paginate(
            {
                where,
                orderBy: [
                    {
                        created_at: "desc",
                    },
                ],
                select: this.select_arguments,
            },
            take,
            skip
        );
    }

    public async listAllGains(user_id: string): Promise<Transaction[]> {
        const data = await this.client.findMany({
            where: {
                user_id,
                type: TransactionType.GAIN
            },
            select: this.select_arguments
        });

        return data;
    }
}

export { TransactionRepository };
