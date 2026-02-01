import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { S3Module } from '../s3/s3.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [S3Module, CommonModule],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule { }
