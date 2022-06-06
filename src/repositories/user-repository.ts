import { User, Prisma } from "@prisma/client";
import BaseRepository from "./base-repository";

class UserRepository extends BaseRepository {
    protected select_arguments = {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        document_number: true,
        balance: true,
        balance_available_for_withdraw: true,

        zipcode: true,
        country: true,
        state: true,
        city: true,
        address_line: true,

        role_id: true,
        created_at: true,
        updated_at: true,
        is_active: true,
        password: true,

        contract: {
            select: {
                period: true,
            },
        },
    };

    constructor() {
        super();
        this.setClient(this.prisma.user);
    }

    public getByEmail(email: string): Promise<User> {
        return this.client.findUnique({
            where: {
                email,
            },
            select: {
                ...this.select_arguments,
                password: true,
            },
        });
    }

    public async getById(id: string): Promise<User> {
        const result = await this.client.findFirst({
            where: {
                id: id,
            },
            select: {
                ...this.select_arguments,
            },
        });

        return {
            ...result,
            period: result.contract.period,
        };
    }

    public async getByIdJoinContract(id: string) {
        return await this.client.findFirst({
            where: {
                id: id,
            },
            select: {
                ...this.select_arguments,
                contract: {
                    select: {
                        period: true,
                        is_expired: true,
                        expires_at: true,
                        started_at: true
                    },
                },
            },
        });
    }

    public async create(user: Prisma.UserCreateInput) {
        return await this.client.create({
            data: user,
            select: this.select_arguments,
        });
    }

    public async update(user: Prisma.UserUpdateInput) {
        return await this.client.update({
            where: {
                id: user.id,
            },
            data: user,
            select: this.select_arguments,
        });
    }

    public async listAll(role_id: string): Promise<any[]> {
        const result = await this.client.findMany({
            where: {
                role_id,
            },
            select: this.select_arguments,
        });

        return result.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                balance: user.balance,
                created_at: user.created_at,
                updated_at: user.updated_at,
                is_active: user.is_active ? "Ativo" : "Inativo",
            };
        });
    }

    public async listJoinContract(role_id: string): Promise<any[]> {
        const result = await this.client.findMany({
            where: {
                role_id,
                is_active: true,
            },
            include: {
                contracts: true,
            },
        });

        return result;
    }

    public async getProfile(user_id: string): Promise<User> {
        return this.client.findFirst({
            where: { id: user_id },
            select: { ...this.select_arguments, password: true },
        });
    }

    public async hasRole(user_id: string, role_id: string): Promise<boolean> {
        const user = await this.client.findFirst({
            where: {
                id: user_id,
                role_id,
            },
            select: {
                id: true,
            },
        });

        return user != null;
    }

    public async changePassword(user_id: string, password: string): Promise<boolean> {
        const user = await this.client.update({
            where: {
                id: user_id,
            },
            data: {
                password,
            },
        });

        return user;
    }

    public async increaseGainBalance(user_id: string, gain: number) {
        const user = await this.client.update({
            where: { id: user_id },
            data: { 
                balance: { increment: gain },
                balance_available_for_withdraw: { increment: gain } 
            },
            select: this.select_arguments,
        });

        return user;
    }

    public async decreaseBalanceAndAvailableBalance(user_id: string, value: number) {
        const user = await this.client.update({
            where: { id: user_id },
            data: { 
                balance: { increment: value * -1 },
                balance_available_for_withdraw: { increment: value * -1 }
            },
            select: this.select_arguments,
        });

        return user;
    }
}

export default UserRepository;
