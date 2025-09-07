import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductSchema } from './product.shema';
import { ProductMapper } from './product.mapper';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [
    ProductMapper,
    {
      provide: ProductRepository,
      useFactory: (model: Model<Product>, mapper: ProductMapper) => {
        return new ProductRepository(model, mapper);
      },
      inject: [getModelToken(Product.name), ProductMapper],
    },
  ],
  exports: [ProductRepository],
})
export class ProductDatabaseModule {}
