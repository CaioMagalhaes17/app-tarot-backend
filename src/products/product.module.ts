import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { CreateProductUseCase } from './use-cases/create-product';
import { ProductRepository } from './database/product.repository';
import { IProductRepository } from './database/product.repository.interface';
import { ProductDatabaseModule } from './database/product.module';
import { FetchProductsByCategoryUseCase } from './use-cases/fetch-products-by-category';

@Module({
  imports: [ProductDatabaseModule],
  controllers: [ProductController],
  providers: [
    {
      provide: CreateProductUseCase,
      useFactory: (productRepository: IProductRepository) => {
        return new CreateProductUseCase(productRepository);
      },
      inject: [ProductRepository],
    },
    {
      provide: FetchProductsByCategoryUseCase,
      useFactory: (productRepository: IProductRepository) => {
        return new FetchProductsByCategoryUseCase(productRepository);
      },
      inject: [ProductRepository],
    },
  ],
})
export class ProductModule {}
