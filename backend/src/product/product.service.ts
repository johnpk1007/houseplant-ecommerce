import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { ProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma, Product } from '../../generated/prisma/client';
import { AfterUploadProduct } from './type';
import { OrderForPayment } from '../payment/type';
import { imageSize } from 'image-size'

@Injectable()
export class ProductService {
    private readonly endpoint: string;
    private readonly bucket: string;
    constructor(
        private s3Service: S3Service,
        private prismaService: PrismaService,
        private configService: ConfigService,
    ) {
        this.endpoint = this.configService.getOrThrow<string>('S3_PUBLIC_ENDPOINT'),
            this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
    }

    async uploadProduct({ file, dto }: { file: Express.Multer.File, dto: ProductDto }) {
        let s3KeyName: string | null = null
        try {
            s3KeyName = await this.s3Service.putObject({ file })
            const url = `${this.endpoint}/${this.bucket}/${s3KeyName}`
            const { height, width } = imageSize(file.buffer)
            const { keyName, ...rest } = await this.prismaService.product.create({
                data: {
                    keyName: s3KeyName, height, width, ...dto
                }
            })
            return { ...rest, url }
        } catch (error) {
            if (s3KeyName) {
                await this.s3Service.deleteObject({ keyName: s3KeyName }).catch(err => console.error('S3 Rollback Failed:', err))
            }
            console.error(error)
            throw new InternalServerErrorException({ message: 'PRODUCT UPLOAD FAILED' });
        }
    }

    async getProduct({ id, tx }: { id: number, tx?: Prisma.TransactionClient }): Promise<AfterUploadProduct> {
        const prismaService = tx ?? this.prismaService
        const { keyName, ...rest } = await prismaService.product.findUniqueOrThrow({ where: { id } })
        const url = `${this.endpoint}/${this.bucket}/${keyName}`
        return { ...rest, url }
    }

    async getManyProducts({ productIdArray, tx }: { productIdArray: number[], tx?: Prisma.TransactionClient }) {
        const prismaService = tx ?? this.prismaService
        return await prismaService.product.findMany({
            where: { id: { in: productIdArray }, isDeleted: false },
            select: { id: true, stock: true, version: true }
        })
    }

    async getAllProducts(): Promise<AfterUploadProduct[]> {
        const products = await this.prismaService.product.findMany({
            where: { isDeleted: false }
        })
        return products.map((product) => {
            const { keyName, ...rest } = product
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            return { ...rest, url }
        })
    }

    async updateProduct({ prismaId, file, dto }: { prismaId: number, file?: Express.Multer.File, dto?: UpdateProductDto }) {
        let newS3keyName: string | null = null
        const newData: Partial<Product> = {
            ...(dto ?? {})
        }
        const product = await this.prismaService.product.findUniqueOrThrow({ where: { id: prismaId } })
        try {
            if (file) {
                newS3keyName = await this.s3Service.putObject({ file })
                newData.keyName = newS3keyName
                const dimensions = imageSize(file.buffer)
                newData.height = dimensions.height
                newData.width = dimensions.width
            }
            const { keyName, ...rest } = await this.prismaService.product.update({ where: { id: prismaId, version: product.version }, data: { ...newData, version: { increment: 1 } } })
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            if (file) {
                await this.s3Service.deleteObject({ keyName: product.keyName }).catch((error) => { console.error(error) })
            }
            return { ...rest, url }
        } catch (error) {
            if (newS3keyName) {
                await this.s3Service.deleteObject({ keyName: newS3keyName }).catch(err => console.error('S3 Rollback Failed:', err))
            }
            throw new InternalServerErrorException({ message: 'PRODUCT UPDATE FAILED' })
        }
    }

    async deleteProduct({ prismaId }: { prismaId: number }): Promise<Product> {
        try {
            return await this.prismaService.product.update({ where: { id: prismaId }, data: { isDeleted: true, deletedAt: new Date() } })
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException({ message: 'PRODUCT NOT FOUND' });
            }
            throw new InternalServerErrorException({ message: 'DELETE PRODUCT FAILED' })
        }
    }

    async restoreProduct({ prismaId }: { prismaId: number }) {
        try {
            return await this.prismaService.product.update({ where: { id: prismaId }, data: { isDeleted: false, deletedAt: null } })
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException({ message: 'PRODUCT NOT FOUND' });
            }
            throw new InternalServerErrorException({ message: 'RESTORE PRODUCT FAILED' })
        }
    }

    async decreaseManyProductStock({ orderArray, tx }: { orderArray: OrderForPayment[], tx?: Prisma.TransactionClient }) {
        const prismaService = tx ?? this.prismaService
        return Promise.all(
            orderArray.map(async (order) => {
                return await prismaService.product.update({
                    where: { id: order.productId, version: order.productVersion },
                    data: { stock: { decrement: order.quantity }, version: { increment: 1 } }
                })
            })
        )
    }
}
