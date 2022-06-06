import { Prisma } from "@prisma/client";

export const users: Prisma.UserCreateInput[] = [
    {
        name: "Admin",
        email: "admin@admin.com",
        password: "$2a$12$PA8xfUMYhCRPyCpCEf7YKeeKf0QcH6RLmHHmwA2vk8zw2PaiW7jH6",
        role: {
            connect: {
                name: "Admin",
            },
        },
    },
];
