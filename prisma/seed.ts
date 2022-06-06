import { Prisma } from "@prisma/client";
import { prisma } from "../src/helpers/db";
import { formatDateToDB } from "../src/helpers/general";

import { roles } from "./seed-data/roles";
import { users } from "./seed-data/users";

const createRoles = async () => {
    roles.forEach(async (r) => {
        await prisma.role.upsert({
            where: {
                name: r.name,
            },
            create: r,
            update: {},
        });
    });
};

const createUsers = async () => {
    users.forEach(async (u) => {
        await prisma.user.upsert({
            where: {
                email: u.email,
            },
            create: u,
            update: {},
        });
    });
};

async function main() {
    await createRoles();
    setTimeout(async () => await createUsers());
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
