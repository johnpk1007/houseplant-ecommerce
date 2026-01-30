import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as bcrypt from "bcrypt"

dotenv.config();

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter });

async function main() {
    const hash = await bcrypt.hash('password', 10);
    await prisma.user.upsert({
        where: { email: 'admin@email.com' },
        update: {},
        create: {
            email: 'admin@email.com',
            hash,
            role: 'ADMIN'
        },
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })