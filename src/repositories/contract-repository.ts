import { Prisma } from "@prisma/client";
import BaseRepository from "./base-repository";

class ContractRepository extends BaseRepository {
    protected select_arguments = {
        user_id: true,
        period: true,
        created_at: true,
    };

    constructor() {
        super();
        this.setClient(this.prisma.contract);
    }

    public async create(contract: Prisma.ContractCreateInput) {
        return await this.client.create({
            data: contract,
            select: this.select_arguments,
        });
    }

}

export { ContractRepository };
