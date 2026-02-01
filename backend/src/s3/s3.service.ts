import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { S3Client, CreateBucketCommand, HeadBucketCommand, PutObjectCommand, PutBucketPolicyCommand, DeleteObjectCommand, ListObjectsCommand, DeleteObjectsCommand, GetObjectCommandOutput, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Injectable()
export class S3Service implements OnModuleInit {
    private readonly s3Client: S3Client
    private readonly bucketName: string
    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
            region: 'auto',
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESS_KEY'),
            },
            forcePathStyle: true,
        })
        this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
    }
    async onModuleInit() {
        try {
            await this.s3Client.send(new HeadBucketCommand({
                Bucket: this.bucketName,
            }),)
        } catch (error) {
            await this.s3Client.send(new CreateBucketCommand({
                Bucket: this.bucketName,
            }),)
        }

        const readOnlyUserPolicy = {
            Bucket: this.bucketName,
            Policy: `{"Version": "2012-10-17", 
            "Statement": 
            [{ "Sid": "ReadOnly",
             "Effect": "Allow",
             "Principal": "*", 
             "Action": [ "s3:GetObject"], 
             "Resource": ["arn:aws:s3:::${this.bucketName}/*" ] 
             }]
             }`
        };;

        const command = new PutBucketPolicyCommand(readOnlyUserPolicy)
        await this.s3Client.send(command);
    }
    async putObject({ file }: { file: Express.Multer.File }): Promise<string> {
        const originalName = file.originalname
        const extension = path.extname(originalName)
        const fileName: string = uuid()
        const keyName: string = `${fileName}${extension}`
        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucketName,
            Key: keyName,
            Body: file.buffer,
            ContentType: file.mimetype
        }))
        return keyName
    }

    async getObject({ keyName }: { keyName: string }): Promise<GetObjectCommandOutput> {
        return await this.s3Client.send(new GetObjectCommand({
            Bucket: this.bucketName,
            Key: keyName
        }))
    }

    async deleteObject({ keyName }: { keyName: string }): Promise<void> {
        await this.s3Client.send(new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: keyName
        }))
    }

    async clearBucket() {
        const { Contents } = await this.s3Client.send(new ListObjectsCommand({ Bucket: this.bucketName }))
        if (!Contents || Contents.length === 0) return;
        const list = Contents.map((obj) => ({ Key: obj.Key }))
        await this.s3Client.send(new DeleteObjectsCommand({
            Bucket: this.bucketName,
            Delete: {
                Objects: list
            },
        }))
    }
}