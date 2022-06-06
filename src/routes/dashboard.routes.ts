import { Router } from "express";
import DashboardController from "../controllers/dashboard-controller";

const dashboardController = new DashboardController();

const dashboardRouter = Router();

dashboardRouter.get("/percentual-gain-per-month", dashboardController.percentualGainPerMonthHistory.bind(dashboardController));
dashboardRouter.get("/user-data", dashboardController.userData.bind(dashboardController));

export default dashboardRouter;
