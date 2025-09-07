import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductUseCase } from './use-cases/create-product';
import { FetchProductsByCategoryUseCase } from './use-cases/fetch-products-by-category';
import { CreateProductDto } from './schemas/product-create.schema';

@Controller('/product')
export class ProductController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private fetchProductsByCategoryUseCase: FetchProductsByCategoryUseCase,
  ) {}

  @Post()
  async createProduct(@Body() productPayload: CreateProductDto) {
    const response = await this.createProductUseCase.execute(productPayload);
    return response.value;
  }
}
