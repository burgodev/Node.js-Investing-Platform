import { l } from "../../helpers/general";
import bcrypt from "bcrypt";
import fs from "fs";
import jwt from "jsonwebtoken";
import ValidationError from "../../errors/validation-error";
import UnauthenticatedError from "../../errors/unauthenticated-error";
import UserRepository from "../../repositories/user-repository";
import RoleRepository from "../../repositories/role-repository";

class AuthService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async login(email: string, password: string): Promise<{ token: string; role: string; name: string }> {
        const user = await this.userRepository.getByEmail(email);
        if (!user) throw new ValidationError("user.not_found");

        const pass_valid = await bcrypt.compare(password, user.password);

        if (!pass_valid) throw new ValidationError("auth.credentials_invalid");

        if (user.email_checked_at === null)
            throw new UnauthenticatedError("auth.email_confirmation.email_not_verified", { email_not_verified: true });

        const privateKey = fs.readFileSync(`${__dirname}/../../certs/private.key`);
        const token = jwt.sign(
            {
                user_id: user.id,
            },
            privateKey,
            {
                expiresIn: "1d",
                algorithm: "RS256",
            }
        );

        const role = await new RoleRepository().getById(user.role_id);

        return {
            token,
            role: role.name,
            name: user.name,
        };
    }
}

export default AuthService;
