import { Request, Response, NextFunction } from "express";
import APIError from "../errors/api-error";
import UnauthenticatedError from "../errors/unauthenticated-error";
import { l } from "../helpers/general";
import RoleRepository from "../repositories/role-repository";
import UserRepository from "../repositories/user-repository";

/**
 * @param str_role available roles: Client|Admin
 */


export function hasRole(str_role: string) {
    try {
        const roles = str_role.split("|");
        const user_repository = new UserRepository();
        const role_repository = new RoleRepository();

        return async (req: Request, res: Response, next: NextFunction) => {
            let has_role = false;
            for (let role of roles) {
                const role_obj = await role_repository.getRoleByName(role);
                if (has_role) continue;
                has_role = await user_repository.hasRole(req.auth.user_id, role_obj.id);
            }

            if (has_role) {
                next();
            } else {
                l.warn("User attempt to access a role restricted endpoint", {
                    accepted_roles: roles,
                });
            
                throw new UnauthenticatedError();
            }
        };
    } catch (error) {
        throw new APIError();
    }
}
