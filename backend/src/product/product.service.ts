import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { ProductDto, NewProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Product } from '../../generated/prisma/client';
import { AfterUploadProduct } from './type';
import { Readable } from 'node:stream';

@Injectable()
export class ProductService {
    constructor(
        private s3Service: S3Service,
        private prismaService: PrismaService,
        private configService: ConfigService
    ) { }
    async uploadProduct(file: Express.Multer.File, productDto: ProductDto): Promise<AfterUploadProduct> {
        const s3KeyName = await this.s3Service.putObject(file)
        const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT')
        const bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
        const url = `${endpoint}/${bucket}/${s3KeyName}`
        try {
            const { keyName, ...rest } = await this.prismaService.product.create({
                data: {
                    keyName: s3KeyName, ...productDto
                }
            })
            return { ...rest, url: url }
        } catch (prismaError) {
            try {
                this.s3Service.deleteObject(s3KeyName)
            } catch (s3Error) {
                console.error(s3Error)
                throw new InternalServerErrorException(`Failed to create data using Prisma client & Failed to rollback using S3 cleint`)
            }
            console.error(prismaError)
            throw new InternalServerErrorException('Failed to create data using Prisma client & Succeeded to rollback using S3 client')
        }
    }

    async getProduct(id: number): Promise<AfterUploadProduct> {
        try {
            const { keyName, ...rest } = await this.prismaService.product.findFirstOrThrow({ where: { id } })
            const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT')
            const bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
            const url = `${endpoint}/${bucket}/${keyName}`
            return { ...rest, url }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    console.error(error)
                    throw new NotFoundException(`Product with ID ${id} not found`)
                }
            }
            console.error(error)
            throw new InternalServerErrorException('Failed to get data using Prisma client')
        }
    }

    async getAllProduct(): Promise<AfterUploadProduct[]> {
        try {
            const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT')
            const bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
            const products = await this.prismaService.product.findMany()
            return products.map((product) => {
                const { keyName, ...rest } = product
                const url = `${endpoint}/${bucket}/${keyName}`
                return { ...rest, url }
            })
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('Failed to get data using Prisma client')
        }
    }

    async editProduct(id: number, file?: Express.Multer.File, newProductDto?: NewProductDto): Promise<AfterUploadProduct> {
        let oldProductKeyName: string | undefined
        let newProductKeyName: string | undefined
        let response: AfterUploadProduct
        const endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT')
        const bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
        try {
            oldProductKeyName = (await this.prismaService.product.findUniqueOrThrow({ where: { id } })).keyName
        } catch (prismaError) {
            if (prismaError instanceof PrismaClientKnownRequestError) {
                if (prismaError.code === 'P2025') {
                    console.error(prismaError)
                    throw new NotFoundException(`Product with ID ${id} not found`)
                }
            }
            console.error(prismaError)
            throw new InternalServerErrorException('Failed to get data using Prisma client')
        }
        const newData: Partial<Product> = {
            ...(newProductDto ?? {})
        }
        if (file) {
            newProductKeyName = await this.s3Service.putObject(file)
            newData.keyName = newProductKeyName
        }
        try {
            const { keyName, ...rest } = await this.prismaService.product.update({ where: { id }, data: { ...newData } })
            const url = `${endpoint}/${bucket}/${keyName}`
            response = { ...rest, url }
        } catch (prismaError) {
            if (newProductKeyName) {
                try {
                    await this.s3Service.deleteObject(newProductKeyName)
                } catch (s3Error) {
                    console.error(s3Error)
                    throw new InternalServerErrorException(`${prismaError.message} & Failed to rollback data using S3 client`)
                }
            }
            console.error(prismaError)
            throw new InternalServerErrorException('Failed to update data using Prisma client')
        }
        if (file) {
            try {
                await this.s3Service.deleteObject(oldProductKeyName)
            } catch (s3Error) {
                console.log(s3Error)
            }
        }
        return response
    }


    async deleteProduct(id: number): Promise<Product> {
        try {
            return await this.prismaService.product.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } })
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('Failed to delete data using Prisma client')
        }
    }

    async restoreProduct(id: number): Promise<Product> {
        try {
            return await this.prismaService.product.update({ where: { id }, data: { isDeleted: false, deletedAt: null } })
        } catch (error) {
            throw new InternalServerErrorException('Failed to restore data using Prisma client')
        }
    }
}
