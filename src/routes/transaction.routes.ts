import { Router } from "express";
import TransactionController from "../controllers/transaction-controller";

const transaction_controller = new TransactionController();

const TransactionRoutes = Router();

TransactionRoutes.get("/", transaction_controller.list.bind(transaction_controller));
TransactionRoutes.post("/list", transaction_controller.listByTransactionType.bind(transaction_controller));
TransactionRoutes.post("/withdraw", transaction_controller.withdraw.bind(transaction_controller));
TransactionRoutes.post("/gain", transaction_controller.gain.bind(transaction_controller));

export default TransactionRoutes;
