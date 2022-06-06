import { Prisma, TransactionType } from "@prisma/client";
import UserRepository from "../../repositories/user-repository";
import bcrypt from "bcrypt";
import RoleRepository from "../../repositories/role-repository";
import ValidationError from "../../errors/validation-error";
import { TransactionRepository } from "../../repositories/transaction-repository";
import { ContractRepository } from "../../repositories/contract-repository";

class UserService {
    private user_repository: UserRepository;
    private role_repository: RoleRepository;
    private transaction_repository: TransactionRepository;
    private contract_repository: ContractRepository;

    constructor() {
        this.user_repository = new UserRepository();
        this.role_repository = new RoleRepository();
        this.transaction_repository = new TransactionRepository();
        this.contract_repository = new ContractRepository();
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(12);
        return await bcrypt.hash(password, salt);
    }

    public async checkUser(email: string) {
        const checkEmail = await this.user_repository.getByEmail(email);
        if (checkEmail) {
            throw new ValidationError("User.already_exists");
        }
        return checkEmail;
    }

    public async getById(id: string) {
        const data = await this.user_repository.getById(id);

        if (!data) {
            throw new ValidationError("User.not_found");
        }
        return data;
    }

    public async create(data: Prisma.UserCreateInput, balance: number, period: number) {
        const new_password = await this.hashPassword(data.password);
        const role = await this.role_repository.getRoleByName("Client");

        const new_data = {
            ...data,
            password: new_password,
            role_id: role.id,
            balance
        };

        const user = await this.user_repository.create(new_data);

        const new_transaction = {
            user: { connect: { id: user.id } },
            balance,
            type: TransactionType.DEPOSIT,
        };

        await this.transaction_repository.create(new_transaction);

        const now = new Date();
        const expires_at = new Date(now.setMonth( now.getMonth() + period ));

        const new_contract = {
            user: { connect: { id: user.id } },
            period,
            expires_at,
            is_expired: false
        };

        await this.contract_repository.create(new_contract);

        return user;
    }

    public async update(data: Prisma.UserUpdateInput) {
        const update_data: Prisma.UserUpdateInput = {
            id: data.id,
            name: data.name,
            email: data.email,
            document_number: data.document_number,
            phone_number: data.phone_number,
            country: data.country,
            state: data.state,
            city: data.city,
            address_line: data.address_line,
            zipcode: data.zipcode
        }

        const user = await this.user_repository.update(update_data);

        if (!user) {
            throw new ValidationError("User.failed_on_update");
        }

        return user;
    }

    public async listAll() {
        const role = await this.role_repository.getRoleByName("Client");
        const data = await this.user_repository.listAll(role.id);

        return data;
    }

    public async getProfile(user_id: string) {
        const user = await this.user_repository.getProfile(user_id);
        
        const formatted_user = {
            id: user.id,
            name: user.name,
            email: user.email,
            document_number: user.document_number,
            phone_number: user.phone_number,
            country: user.country,
            state: user.state,
            city: user.city,
            address_line: user.address_line,
            zipcode: user.zipcode
        }

        return formatted_user;
    }

    public async changePassword(user_id: string, old_password: string, new_password: string) {
        const user_check = await this.user_repository.getProfile(user_id);
        if (!user_check) throw new ValidationError("User.not_found");

        const check_pass = await bcrypt.compare(old_password, user_check.password);

        if (!check_pass) throw new ValidationError("User.invalid_current_password");

        const new_pass = await this.hashPassword(new_password);
        const user = await this.user_repository.changePassword(user_id, new_pass);

        if (!user) throw new ValidationError("User.invalid_information");

        return user;
    }
}

export { UserService };
