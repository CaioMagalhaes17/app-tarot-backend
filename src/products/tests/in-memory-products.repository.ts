import { IProductRepository } from '../database/product.repository.interface';
import { ProductCategory, ProductEntity } from '../product-entity';

export class InMemoryProductRepository implements IProductRepository {
  products: ProductEntity[] = [];

  async create(data: ProductEntity): Promise<{ id: string }> {
    this.products.push(data);
    return { id: data.id.toString() };
  }

  async findProductByCategory(
    category: ProductCategory,
  ): Promise<ProductEntity[]> {
    const result = this.products.filter(
      (product) => product.category === category,
    );
    return result;
  }

  findAll(): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }
  updateById(id: string, updateData: ProductEntity): Promise<ProductEntity> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteAll(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.');
  }
  search(field: string, query: string): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.');
  }
  findAllPaginated<T>(page: number, limit: number, param?: T) {
    throw new Error('Method not implemented.');
  }
}
