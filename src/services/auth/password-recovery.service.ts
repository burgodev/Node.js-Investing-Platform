import APIError from "../../errors/api-error";
import ValidationError from "../../errors/validation-error";
import { generateUUID } from "../../helpers/general";
import PasswordRecoveryRepository from "../../repositories/password-recovery-repository";
import UserRepository from "../../repositories/user-repository";
import EmailService from "../mail/mail.service";
import { User } from "@prisma/client";

class PasswordRecoveryService {
    private email_service: EmailService;
    private repository: PasswordRecoveryRepository;

    constructor() {
        this.email_service = new EmailService();
        this.repository = new PasswordRecoveryRepository();
    }

    private async sendEmail(user: User, token: string): Promise<boolean> {
        const url = `${process.env.APP_URL}/auth/password-recovery/${token}`;

        return await this.email_service.send({
            destination: user.name
                ? {
                      name: user.name,
                      email: user.email,
                  }
                : user.email,
            subject: "Select Markets - Password recovery",
            text: `${user.name}, you requested password recovery on our system. To be able to make the exchange, access the link below and reset your password. (${url})`,
            html: {
                path: "password-recovery.html",
                args: {
                    url: url,
                    email_password_recovery_title: {
                        translate: "auth.pessword_recovery.title",
                        args: {
                            user_name: user.name as string,
                        },
                    },
                    password_recovery_bt: {
                        translate: "auth.pessword_recovery.bt",
                    },
                },
            },
        });
    }

    public async hasRequestedInLastMinutes(user_id: string, minutes = 5): Promise<boolean> {
        return await this.repository.hasRequestedInLastMinutes(user_id, minutes);
    }

    public async request(email: string): Promise<boolean | string[]> {
        const user_repository = new UserRepository();
        const user = await user_repository.getByEmail(email);
        if (!user) throw new ValidationError("user.not_found");

        if (await this.hasRequestedInLastMinutes(user.id))
            throw new ValidationError("auth.pessword_recovery.already_requested");

        return await this.create(user);
    }

    public async create(user: User): Promise<boolean> {
        const token = generateUUID();
        const now = new Date();

        const password_recovery = this.repository.create({
            user_id: user.id,
            token,
            expires_at: new Date(now.setMinutes(now.getMinutes() + 30)),
        });

        if (password_recovery == null) throw new APIError("Something is wrong");

        return await this.sendEmail(user, token);
    }

    public async validateToken(token: string): Promise<string> {
        const user_id = await this.repository.tokenIsValid(token);

        if (user_id) {
            await this.repository.invalidateToken(token);
        }

        return user_id;
    }
}

export default PasswordRecoveryService;
