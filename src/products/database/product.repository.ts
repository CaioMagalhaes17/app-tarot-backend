import { BaseInfraRepository } from 'src/core/base.repository';
import { IProductRepository } from './product.repository.interface';
import { Model } from 'mongoose';
import { Product } from './product.shema';
import { ProductMapper } from './product.mapper';
import { ProductCategory, ProductEntity } from '../product-entity';

export class ProductRepository
  extends BaseInfraRepository<Product, ProductEntity>
  implements IProductRepository {
  constructor(
    protected readonly model: Model<Product>,
    protected readonly mapper: ProductMapper,
  ) {
    super(model, mapper);
  }

  async findProductByCategory(
    category: ProductCategory,
  ): Promise<ProductEntity[]> {
    const response = await this.model.find({ category }).lean().exec();
    return this.mapper.toDomainArray(response);
  }
}
