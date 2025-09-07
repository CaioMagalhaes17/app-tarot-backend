import { BaseDomainRepository } from 'src/core/base.repository.interface';
import { ProductCategory, ProductEntity } from '../product-entity';

export interface IProductRepository
  extends BaseDomainRepository<ProductEntity> {
  findProductByCategory(category: ProductCategory): Promise<ProductEntity[]>;
}
