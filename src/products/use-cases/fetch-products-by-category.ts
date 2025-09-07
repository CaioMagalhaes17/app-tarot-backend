import { Either, right } from 'src/core/Either';
import { IProductRepository } from '../database/product.repository.interface';
import { ProductCategory, ProductEntity } from '../product-entity';

export class FetchProductsByCategoryUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    category: ProductCategory,
  ): Promise<Either<null, ProductEntity[]>> {
    const result = await this.productRepository.findProductByCategory(category);
    return right(result);
  }
}
