import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto, EditProductDto } from './dto';
import { JwtGuard, RolesGuard } from '../common/guard';
import { Roles } from '../common/decorator';
import { Role } from '../common/enum';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    @Roles(Role.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadProduct(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: ProductDto
    ) {
        return await this.productService.uploadProduct({ file, dto })
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.getProduct({ id })
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
        @Body() dto: EditProductDto
    ) {
        return await this.productService.editProduct({ id, file, dto })
    }

    @Delete(':id')
    @Roles(Role.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async deleteProduct(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.productService.deleteProduct({ id })
    }

    @Patch(':id/restore')
    @Roles(Role.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    async restoreProduct(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.productService.restoreProduct({ id })
    }
}
