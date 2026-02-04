import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { S3Module } from '../s3/s3.module';
import { CommonModule } from '../common/common.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [S3Module, CommonModule, StripeModule],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule { }
