import { Request, Response } from "express";
import { UserService } from "../services/admin/user-service";
import { l, r } from "../helpers/general";
import { User } from "@prisma/client";
import ValidationError from "../errors/validation-error";

class UserController {
    private userService: UserService;

    constructor(user_service: UserService) {
        this.userService = user_service;
    }

    public async create(request: Request, response: Response) {
        const { balance, period, ...user_data } = request.body;

        await this.userService.checkUser(user_data.email);

        const data = await this.userService.create(user_data, balance, period);

        return r(response, "User.success_created", data);
    }

    public async listAll(request: Request, response: Response) {
        const data = await this.userService.listAll();

        return r(response, "Success", data);
    }

    public async getProfile(request: Request, response: Response) {
        const { user_id } = request.auth;

        const user = await this.userService.getProfile(user_id);

        return r(response, "Success", user);
    }

    public async getById(request: Request, response: Response) {
        const { id } = request.body;

        if (!id) {
            throw new ValidationError("User.invalid_id");
        }

        const data = await this.userService.getById(id);

        return r(response, "Success", data);
    }

    public async update(request: Request, response: Response) {
        const { ...user_data } = request.body;

        const new_data = {
            ...user_data,
            updated_at: new Date(),
        };

        const data = await this.userService.update(new_data);

        return r(response, "User.success_updated", data);
    }

    public async changePassword(request: Request, response: Response) {
        const { user_id } = request.auth;
        const { old_password, new_password } = request.body;

        const data = await this.userService.changePassword(user_id, old_password, new_password);

        return r(response, "User.success_password_changed", data);
    }
}

export { UserController };
