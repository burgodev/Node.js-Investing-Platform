import { Role, Prisma } from "@prisma/client";
import BaseRepository from "./base-repository";

class RoleRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        name: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.role);
    }

    public getById(id: string): Promise<Role> {
        return this.client.findFirst({
            where: {
                id,
            },
            select: this.select_arguments,
        })
    }

    public getRoleByName(name: string): Promise<Role> {
        return this.client.findFirst({
            where: {
                name,
            },
            select: this.select_arguments,
        });
    }
}

export default RoleRepository;
