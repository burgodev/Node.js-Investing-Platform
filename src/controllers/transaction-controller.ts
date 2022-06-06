import { TransactionType } from "@prisma/client";
import { Response, Request } from "express";
import ValidationError from "../errors/validation-error";
import { paginationParams, r } from "../helpers/general";
import TransactionService from "../services/client/transaction.service";

class TransactionController {
    private service: TransactionService;

    constructor() {
        this.service = new TransactionService();
    }

    public async list(req: Request, res: Response): Promise<Response> {
        const { user_id } = req.auth;
        const { take, skip, order_by, order_type } = paginationParams(req);
        const { type } = req.query;
        const transactions = await this.service.list(user_id, take, skip, order_by, order_type, type?.toString());
        return r(res, "", transactions);
    }

    public async listByTransactionType(req: Request, res: Response): Promise<Response> {
        const { user_id, type } = req.body;
        const paginationParams = { type, take: 3, skip: 0, order_by: "asc", order_type: "asc" };

        const transactions = await this.service.list(
            user_id,
            paginationParams.take,
            paginationParams.skip,
            paginationParams.order_by,
            paginationParams.order_type,
            paginationParams.type
        );
        return r(res, "", transactions);
    }

    public async withdraw(req: Request, res: Response): Promise<Response> {
        const { user_id, amount } = req.body;
        
        if (!amount) { throw new ValidationError("You must inform the amount!"); }

        const transaction = await this.service.withdraw(user_id, amount);
        
        return r(res, "", transaction);
    }

    public async gain(req: Request, res: Response): Promise<Response> {
        const { profit, month, year, user_id } = req.body;

        if (!profit) { throw new ValidationError("Invalid profit!"); }
        if (!month) { throw new ValidationError("Invalid month!"); }
        if (!year) { throw new ValidationError("Invalid year"); }

        const transaction_data = await this.service.gain(user_id, profit, year, month);

        return r(res, "", transaction_data);
    }
}

export default TransactionController;
