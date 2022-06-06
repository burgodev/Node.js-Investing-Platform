import { Response, Request } from "express";
import ValidationError from "../../errors/validation-error";
import { l, r } from "../../helpers/general";
import AuthService from "../../services/auth/auth.service";

class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;

        if (!email || !password) throw new ValidationError("auth.invalid_credentials");

        const response = await this.service.login(email, password);

        return r(res, "auth.login_success", response);
    }
}

export default AuthController;
