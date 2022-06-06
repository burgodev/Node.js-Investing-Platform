import RoleRepository from "../../repositories/role-repository";

class RoleService {
    private role_repository: RoleRepository;

    constructor() {
        this.role_repository = new RoleRepository();
    }

    public async getRoleByName(name: string) {
        return await this.getRoleByName(name);
    }
}

export { RoleService };
