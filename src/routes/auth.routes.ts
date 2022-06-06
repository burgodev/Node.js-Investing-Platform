import { Router } from "express";
import AuthController from "../controllers/auth/auth-controller";
import PasswordRecoveryController from "../controllers/auth/password-recovery-controller";

const auth_controller = new AuthController();
const password_recovery_controller = new PasswordRecoveryController();

const AuthRoutes = Router();

AuthRoutes.post("/sign-in", auth_controller.login.bind(auth_controller));
AuthRoutes.post("/request-password-recovery", password_recovery_controller.requestPasswordRecovery.bind(password_recovery_controller));
AuthRoutes.post("/password-recovery", password_recovery_controller.passwordRecovery.bind(password_recovery_controller));

export default AuthRoutes;
