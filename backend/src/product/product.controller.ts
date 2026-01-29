import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto, NewProductDto } from './dto';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadProduct(
        @UploadedFile() file: Express.Multer.File,
        @Body() productDto: ProductDto
    ) {
        return await this.productService.uploadProduct(file, productDto)
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.getProduct(id)
    }

    @Get()
    async getAllProduct() {
        return await this.productService.getAllProduct()
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('file'))
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateProductDto: NewProductDto
    ) {
        return await this.productService.editProduct(id, file, updateProductDto)
    }

    @Delete(':id')
    async deleteProduct(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.productService.deleteProduct(id)
    }

    @Patch(':id/restore')
    async restoreProduct(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.productService.restoreProduct(id)
    }
}
