import { PrismaService } from "../src/prisma/prisma.service";
import { S3Service } from "../src/s3/s3.service";

export async function cleanPrismaDb(prismaService: PrismaService) {
    await prismaService.$transaction([
        prismaService.cartItem.deleteMany(),
        prismaService.orderItem.deleteMany(),
        prismaService.cart.deleteMany(),
        prismaService.order.deleteMany(),
        prismaService.user.deleteMany({ where: { role: { not: "ADMIN" } } }),
        prismaService.product.deleteMany(),
    ]);
}

export async function cleanS3Db(s3Service: S3Service) {
    await s3Service.clearBucket()
}

export const fakeFile1 = {
    originalname: 'fakeFile1.jpg',
    buffer: Buffer.from('fake file 1'),
    mimetype: 'image/jpeg'
} as Express.Multer.File

export const fakeProductDto1 = {
    name: 'fake product 1',
    price: 10,
    description: 'fake product 1',
    light: 'fake product 1',
    water: 'fake product 1',
    temperature: 'fake product 1'
}

export const fakeFile2 = {
    originalname: 'fakeFile2.jpg',
    buffer: Buffer.from('fake file 2'),
    mimetype: 'image/jpeg'
} as Express.Multer.File

export const fakeProductDto2 = {
    name: 'fake product 2',
    price: 10,
    description: 'fake product 2',
    light: 'fake product 2',
    water: 'fake product 2',
    temperature: 'fake product 2'
}

export const customerDto1 = {
    email: 'john1@gmail.com',
    password: '123456'
}

export const customerDto2 = {
    email: 'john2@gmail.com',
    password: '654321'
}

