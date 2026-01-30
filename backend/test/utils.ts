import { PrismaService } from "../src/prisma/prisma.service";
import { S3Service } from "../src/s3/s3.service";

export async function cleanPrismaDb(prisma: PrismaService) {
    await prisma.$transaction([
        prisma.cartItem.deleteMany(),
        prisma.orderItem.deleteMany(),
        prisma.cart.deleteMany(),
        prisma.order.deleteMany(),
        prisma.user.deleteMany(),
        prisma.product.deleteMany(),
    ]);
}
