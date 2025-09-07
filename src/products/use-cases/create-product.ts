import { Either, right } from 'src/core/Either';
import { ProductEntity, ProductEntityProps } from '../product-entity';
import { IProductRepository } from '../database/product.repository.interface';

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    props: Omit<ProductEntityProps, 'createdAt'>,
  ): Promise<Either<null, null>> {
    const product = ProductEntity.create({ ...props, createdAt: new Date() });
    await this.productRepository.create(product);
    return right(null);
  }
}
