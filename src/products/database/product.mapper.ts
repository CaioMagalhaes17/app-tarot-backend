import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { Product } from './product.shema';
import { ProductEntity } from '../product-entity';

export class ProductMapper
  implements BaseMapperInterface<Product, ProductEntity> {
  toDomainArray(rows: Product[]): ProductEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toDomain(row: any): ProductEntity {
    const { _id, ...rest } = row;
    return ProductEntity.create(
      {
        ...rest,
      },
      _id.toString(),
    );
  }

  toPersistance(domain: ProductEntity) {
    return {
      name: domain.name,
      description: domain.description,
      price: domain.price,
      category: domain.category,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      imageUrl: domain.imageUrl,
    };
  }
}
