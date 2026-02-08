import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { ProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma, Product } from '../../generated/prisma/client';
import { AfterUploadProduct } from './type';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';
import { OrderForPayment } from '../payment/type';

@Injectable()
export class ProductService {
    private readonly endpoint: string;
    private readonly bucket: string;
    constructor(
        private s3Service: S3Service,
        private prismaService: PrismaService,
        private configService: ConfigService,
        private stripeService: StripeService
    ) {
        this.endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT'),
            this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
    }

    async uploadProduct({ file, dto }: { file: Express.Multer.File, dto: ProductDto }) {
        let s3KeyName: string | null = null
        let stripeProductId: string | null = null
        try {
            s3KeyName = await this.s3Service.putObject({ file })
            const url = `${this.endpoint}/${this.bucket}/${s3KeyName}`
            const stripeProduct = await this.stripeService.creatProduct({
                name: dto.name,
                description: dto.description,
                price: dto.price,
                image: url
            })
            stripeProductId = stripeProduct.id
            const stripePriceId = stripeProduct.default_price as string
            const { keyName, ...rest } = await this.prismaService.product.create({
                data: {
                    keyName: s3KeyName, stripeProductId, stripePriceId, ...dto
                }
            })
            return { ...rest, url: url }
        } catch (error) {
            if (stripeProductId) {
                await this.stripeService.updateProduct({ id: stripeProductId, dto: { active: false } }).catch((error) => { console.error(error) })
            }
            if (s3KeyName) {
                await this.s3Service.deleteObject({ keyName: s3KeyName }).catch((error) => { console.error(error) })
            }
            throw new InternalServerErrorException();
        }
    }

    async getProduct({ id, tx }: { id: number, tx?: Prisma.TransactionClient }): Promise<AfterUploadProduct> {
        const prismaService = tx ?? this.prismaService
        const { keyName, ...rest } = await prismaService.product.findFirstOrThrow({ where: { id } })
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
        const products = await this.prismaService.product.findMany()
        return products.map((product) => {
            const { keyName, ...rest } = product
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            return { ...rest, url }
        })
    }

    async updateProduct({ prismaId, file, dto }: { prismaId: number, file?: Express.Multer.File, dto?: UpdateProductDto }) {
        let product: Product | null = null
        let newS3keyName: string | null = null
        let s3KeyUpdatedStripeProduct: Stripe.Response<Stripe.Product> | null = null
        let updatedStripeProduct: Stripe.Response<Stripe.Product> | null = null
        let updatedPrismaProduct: Product | null = null
        const newData: Partial<Product> = {
            ...(dto ?? {})
        }
        try {
            product = await this.prismaService.product.findUniqueOrThrow({ where: { id: prismaId } })
            if (file) {
                newS3keyName = await this.s3Service.putObject({ file })
                newData.keyName = newS3keyName
                const url = `${this.endpoint}/${this.bucket}/${newS3keyName}`
                s3KeyUpdatedStripeProduct = await this.stripeService.updateProduct({ id: product.stripeProductId, dto: { images: [url] } })
            }
            const stripeProductObject = Object.fromEntries(Object.entries(newData).filter((entry) => ['name', 'description'].includes(entry[0])))
            updatedStripeProduct = await this.stripeService.updateProduct({ id: product.stripeProductId, dto: stripeProductObject })
            updatedPrismaProduct = await this.prismaService.product.update({ where: { id: prismaId, version: product.version }, data: { ...newData, version: { increment: 1 } } })
            if (file) {
                await this.s3Service.deleteObject({ keyName: product.keyName }).catch((error) => { console.error(error) })
            }
            return updatedPrismaProduct
        } catch (error) {
            if (product) {
                if (updatedStripeProduct) {
                    await this.stripeService.updateProduct({ id: product.stripeProductId, dto: { name: product.name, description: product.description } }).catch((error) => { console.error(error) })
                }
                if (s3KeyUpdatedStripeProduct) {
                    const url = `${this.endpoint}/${this.bucket}/${product.keyName}`
                    await this.stripeService.updateProduct({ id: product.stripeProductId, dto: { images: [url] } }).catch((error) => { console.error(error) })
                }
                if (newS3keyName) {
                    await this.s3Service.deleteObject({ keyName: newS3keyName }).catch((error) => { console.error(error) })
                }
            }
            throw new InternalServerErrorException()
        }
    }

    async updatePrice({ prismaId, price }: { prismaId: number, price: number }) {
        const product = await this.prismaService.product.findUniqueOrThrow({ where: { id: prismaId } })
        const newStripePriceId = await this.updateStripePrice({ productId: product.stripeProductId, price })
        try {
            return await this.prismaService.product.update({
                where: { id: prismaId }, data: {
                    stripePriceId: newStripePriceId,
                    price
                }
            })
        } catch (prismaError) {
            await this.stripeService.updateProduct({ id: product.stripeProductId, dto: { default_price: product.stripePriceId } }).catch((error) => { console.error(error) })
            await this.stripeService.updatePrice({ priceId: product.stripePriceId, activeStatus: true }).catch((error) => { console.error(error) })
            await this.stripeService.updatePrice({ priceId: newStripePriceId, activeStatus: false }).catch((error) => { console.error(error) })
            throw new InternalServerErrorException('Failed to update price')
        }
    }

    async updateStripePrice({ productId, price }: { productId: string, price: number }) {
        let product: Stripe.Response<Stripe.Product> | null = null
        let newPrice: Stripe.Response<Stripe.Price> | null = null
        let updatedProduct: Stripe.Response<Stripe.Product> | null = null
        let updatedPrice: Stripe.Response<Stripe.Price> | null = null
        try {
            product = await this.stripeService.getProduct({ id: productId })
            newPrice = await this.stripeService.createPrice({ productId, price })
            updatedProduct = await this.stripeService.updateProduct({ id: productId, dto: { default_price: newPrice.id } })
            updatedPrice = await this.stripeService.updatePrice({ priceId: product.default_price as string, activeStatus: false })
            return newPrice.id
        } catch (error) {
            if (product) {
                if (updatedProduct) {
                    await this.stripeService.updateProduct({ id: product.id, dto: { default_price: product.default_price as string } }).catch((error) => { console.error(error) })
                    await this.stripeService.updatePrice({ priceId: product.default_price as string, activeStatus: true }).catch((error) => { console.error(error) })
                }
                if (newPrice) {
                    await this.stripeService.updatePrice({ priceId: newPrice.id as string, activeStatus: false }).catch((error) => { console.error(error) })
                }
            }
            throw new InternalServerErrorException('Failed to update price')
        }
    }


    async deleteProduct({ prismaId }: { prismaId: number }): Promise<Product> {
        let prismaProduct: Product | null = null
        let stripeUpdatedProduct: Stripe.Response<Stripe.Product> | null = null
        let prismaUpdatedProduct: Product | null = null
        try {
            prismaProduct = await this.prismaService.product.findUniqueOrThrow({ where: { id: prismaId } })
            stripeUpdatedProduct = await this.stripeService.updateProduct({ id: prismaProduct.stripeProductId, dto: { active: false } })
            prismaUpdatedProduct = await this.prismaService.product.update({ where: { id: prismaId }, data: { isDeleted: true, deletedAt: new Date() } })
            return prismaUpdatedProduct
        } catch (error) {
            if (prismaProduct && stripeUpdatedProduct) {
                try {
                    await this.stripeService.updateProduct({ id: prismaProduct.stripeProductId, dto: { active: true } })
                } catch (error) {
                    throw new InternalServerErrorException('Failed to rollback using Stripe')
                }
            }
            throw new InternalServerErrorException('Failed to delete product')
        }
    }

    async restoreProduct({ prismaId }: { prismaId: number }) {
        let prismaProduct: Product | null = null
        let stripeUpdatedProduct: Stripe.Response<Stripe.Product> | null = null
        let prismaUpdatedProduct: Product | null = null
        try {
            prismaProduct = await this.prismaService.product.findUniqueOrThrow({ where: { id: prismaId } })
            stripeUpdatedProduct = await this.stripeService.updateProduct({ id: prismaProduct.stripeProductId, dto: { active: true } })
            prismaUpdatedProduct = await this.prismaService.product.update({ where: { id: prismaId }, data: { isDeleted: false, deletedAt: null } })
            return prismaUpdatedProduct
        } catch (error) {
            if (prismaProduct && stripeUpdatedProduct) {
                try {
                    await this.stripeService.updateProduct({ id: prismaProduct.stripeProductId, dto: { active: false } })
                } catch (error) {
                    throw new InternalServerErrorException('Failed to rollback using Stripe')
                }
            }
            throw new InternalServerErrorException('Failed to restore product')
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
