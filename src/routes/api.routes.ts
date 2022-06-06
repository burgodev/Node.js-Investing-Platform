import { Router } from "express";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";
//import { hasRole } from "../middleware/has-role";
import AuthRoutes from "./auth.routes";
import UserRoutes from "./user.routes";
import TransactionRoutes from "./transaction.routes";
import DashboardRoutes from "./dashboard.routes";

const api = Router();

api.get("/test", (req, res) => {
    console.log("Working API");
    res.json({ msg: "Working API: Ax-invest" });
});

api.use("/auth", AuthRoutes);
api.use("/users", UserRoutes);
api.use("/transaction", ensureAuthenticated, TransactionRoutes);
api.use("/dashboard", ensureAuthenticated, DashboardRoutes);

export default api;
