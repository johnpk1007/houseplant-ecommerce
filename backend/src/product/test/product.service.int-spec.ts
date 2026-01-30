import { beforeAll, describe, beforeEach, afterAll, it, expect, vi } from "vitest";
import { ProductService } from "../product.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { S3Service } from "../../s3/s3.service";
import { cleanS3Db, cleanPrismaDb, fakeFile1, fakeFile2, fakeProductDto1, fakeProductDto2 } from "./utils";
import { AfterUploadProduct } from "../type";

describe('Product int', () => {
    let moduleRef: TestingModule
    let productService: ProductService
    let prismaService: PrismaService
    let configService: ConfigService
    let s3Service: S3Service

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
            ],
            providers: [ProductService, PrismaService, S3Service]
        }).compile()
        await moduleRef.init();
        productService = moduleRef.get(ProductService)
        prismaService = moduleRef.get(PrismaService)
        configService = moduleRef.get(ConfigService)
        s3Service = moduleRef.get(S3Service)
    })

    beforeEach(async () => {
        await cleanPrismaDb(prismaService)
        await cleanS3Db(s3Service)
    })

    afterAll(async () => {
        moduleRef.close()
    })

    it('should upload', async () => {
        const productServiceUploadResponse: AfterUploadProduct = await productService.uploadProduct(fakeFile1, fakeProductDto1)
        expect(productServiceUploadResponse).toMatchObject({ ...fakeProductDto1, stock: 0, isDeleted: false, deletedAt: null, url: expect.any(String) })
        const keyName = productServiceUploadResponse.url.slice(productServiceUploadResponse.url.lastIndexOf('/') + 1)
        console.log("keyName:", keyName)
        const s3ServiceUploadResponse = await s3Service.getObject(keyName)
        expect(s3ServiceUploadResponse.$metadata.httpStatusCode).toBe(200)
        expect(s3ServiceUploadResponse.Body).toBeDefined()
        const buffer = Buffer.from(await s3ServiceUploadResponse.Body!.transformToByteArray())
        expect(buffer).toEqual(fakeFile1.buffer)
    })

    it('should edit with file and dto', async () => {
        const productServiceUploadResponse: AfterUploadProduct = await productService.uploadProduct(fakeFile1, fakeProductDto1)
        const productServiceEditResponse: AfterUploadProduct = await productService.editProduct(productServiceUploadResponse.id, fakeFile2, fakeProductDto2)
        expect(productServiceEditResponse).toMatchObject({ ...fakeProductDto2, stock: 0, isDeleted: false, deletedAt: null, url: expect.any(String) })
        const uploadKeyName = productServiceUploadResponse.url.slice(productServiceUploadResponse.url.lastIndexOf('/') + 1)
        const editKeyName = productServiceEditResponse.url.slice(productServiceEditResponse.url.lastIndexOf('/') + 1)
        const s3ServiceEditResponse = await s3Service.getObject(editKeyName)
        expect(s3ServiceEditResponse.$metadata.httpStatusCode).toBe(200)
        expect(s3ServiceEditResponse.Body).toBeDefined()
        const buffer = Buffer.from(await s3ServiceEditResponse.Body!.transformToByteArray())
        expect(buffer).toEqual(fakeFile2.buffer)
        await expect(s3Service.getObject(uploadKeyName)).rejects.toThrow('Failed to get object using S3 client')
    })

    it('should fail to edit because Prisma Service is down and rollback S3 service data', async () => {
        const originalUpdate = prismaService.product.update;
        prismaService.product.update = vi.fn().mockRejectedValue(new Error('DB_ERROR'));
        const s3PutSpy = vi.spyOn(s3Service, 'putObject')
        try {
            const productServiceUploadResponse: AfterUploadProduct = await productService.uploadProduct(fakeFile1, fakeProductDto1)
            await expect(productService.editProduct(productServiceUploadResponse.id, fakeFile2, fakeProductDto2)).rejects.toThrow()
            const uploadKeyName = productServiceUploadResponse.url.slice(productServiceUploadResponse.url.lastIndexOf('/') + 1)
            const s3ServiceUploadResponse = await s3Service.getObject(uploadKeyName)
            expect(s3ServiceUploadResponse.$metadata.httpStatusCode).toBe(200)
            expect(s3ServiceUploadResponse.Body).toBeDefined()
            const buffer = Buffer.from(await s3ServiceUploadResponse.Body!.transformToByteArray())
            expect(buffer).toEqual(fakeFile1.buffer)
            const newKeyName = s3PutSpy.mock.results[0].value
            await expect(s3Service.getObject(newKeyName)).rejects.toThrow()
        } finally {
            prismaService.product.update = originalUpdate;
            s3PutSpy.mockRestore()
        }
    })
})