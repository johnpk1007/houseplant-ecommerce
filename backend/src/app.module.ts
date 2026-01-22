import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, ProductModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), UserModule],
})
export class AppModule { }
