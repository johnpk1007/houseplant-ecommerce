import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { ProductDto, EditProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Product } from '../../generated/prisma/client';
import { AfterUploadProduct } from './type';

@Injectable()
export class ProductService {
    private readonly endpoint: string;
    private readonly bucket: string;
    constructor(
        private s3Service: S3Service,
        private prismaService: PrismaService,
        private configService: ConfigService,
        endpoint = this.configService.getOrThrow<string>('S3_ENDPOINT'),
        bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
    ) { }
    async uploadProduct({ file, dto }: { file: Express.Multer.File, dto: ProductDto }): Promise<AfterUploadProduct> {
        const s3KeyName = await this.s3Service.putObject({ file })
        const url = `${this.endpoint}/${this.bucket}/${s3KeyName}`
        try {
            const { keyName, ...rest } = await this.prismaService.product.create({
                data: {
                    keyName: s3KeyName, ...dto
                }
            })
            return { ...rest, url: url }
        } catch (prismaError) {
            try {
                this.s3Service.deleteObject({ keyName: s3KeyName })
            } catch (s3Error) {
                throw new InternalServerErrorException('Database update failed and S3 rollback also failed');
            }
            throw prismaError
        }
    }

    async getProduct({ id }: { id: number }): Promise<AfterUploadProduct> {
        const { keyName, ...rest } = await this.prismaService.product.findFirstOrThrow({ where: { id } })
        const url = `${this.endpoint}/${this.bucket}/${keyName}`
        return { ...rest, url }
    }

    async getAllProduct(): Promise<AfterUploadProduct[]> {
        const products = await this.prismaService.product.findMany()
        return products.map((product) => {
            const { keyName, ...rest } = product
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            return { ...rest, url }
        })
    }

    async editProduct({ id, file, dto }: { id: number, file?: Express.Multer.File, dto?: EditProductDto }): Promise<AfterUploadProduct> {
        let newProductKeyName: string | undefined
        let response: AfterUploadProduct
        const oldProduct = (await this.prismaService.product.findUniqueOrThrow({ where: { id } }))
        const oldProductKeyName = oldProduct.keyName
        const oldProductVersion = oldProduct.version
        const newData: Partial<Product> = {
            ...(dto ?? {})
        }
        if (file) {
            newProductKeyName = await this.s3Service.putObject({ file })
            newData.keyName = newProductKeyName
        }
        try {
            const { keyName, ...rest } = await this.prismaService.product.update({ where: { id, version: oldProductVersion }, data: { ...newData, version: { increment: 1 } } })
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            response = { ...rest, url }
        } catch (prismaError) {
            if (newProductKeyName) {
                try {
                    await this.s3Service.deleteObject({ keyName: newProductKeyName })
                } catch (s3Error) {
                    throw new InternalServerErrorException('Database update failed and S3 rollback also failed');
                }
            }
            throw prismaError
        }
        if (file) {
            await this.s3Service.deleteObject({ keyName: oldProductKeyName })
        }
        return response
    }


    async deleteProduct({ id }: { id: number }): Promise<Product> {
        return await this.prismaService.product.update({ where: { id }, data: { isDeleted: true, deletedAt: new Date() } })
    }

    async restoreProduct({ id }: { id: number }): Promise<Product> {
        return await this.prismaService.product.update({ where: { id }, data: { isDeleted: false, deletedAt: null } })
    }
}
