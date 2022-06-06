import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { ensureAuthenticated } from "../middleware/ensure-authenticated";
import { UserService } from "../services/admin/user-service";

const user_service = new UserService();
const user_controller = new UserController(user_service);

const UserRoutes = Router();

UserRoutes.get("/profile", ensureAuthenticated, user_controller.getProfile.bind(user_controller));
UserRoutes.post("/new", user_controller.create.bind(user_controller));
UserRoutes.get("/", user_controller.listAll.bind(user_controller));
UserRoutes.post("/", user_controller.getById.bind(user_controller));
UserRoutes.post("/update", user_controller.update.bind(user_controller));
UserRoutes.post("/password-change", ensureAuthenticated, user_controller.changePassword.bind(user_controller));

export default UserRoutes;
