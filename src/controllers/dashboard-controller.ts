import DashboardService from "../services/client/dashboard.service";
import { Request, Response } from "express";
import { r } from "../helpers/response";

class DashboardController {
    
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    public async percentualGainPerMonthHistory(request: Request, response: Response) {
        const { user_id } = request.auth;

        const data = await this.dashboardService.percentualGainPerMonthHistory(user_id);

        return r(response, "", data);
    }

    public async balanceEvolutionHistory(request: Request, response: Response) {

    }

    public async userData(request: Request, response: Response) {
        const { user_id } = request.auth;

        const data = await this.dashboardService.getUserData(user_id);

        return r(response, "", data);
    }

}

export default DashboardController;