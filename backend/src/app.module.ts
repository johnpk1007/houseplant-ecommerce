import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { S3Module } from './s3/s3.module';

@Module({
  imports: [AuthModule, ProductModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), UserModule, S3Module],
})
export class AppModule { }
