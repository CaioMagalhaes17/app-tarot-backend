import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

export type ProductCategory = 'minutes' | 'appointment';

export type ProductEntityProps = {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class ProductEntity extends BaseEntity<ProductEntityProps> {
  static create(props: ProductEntityProps, id?: string) {
    return new ProductEntity(props, new UniqueEntityID(id));
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get category() {
    return this.props.category;
  }

  get price() {
    return this.props.price;
  }

  get imageUrl() {
    return this.props.imageUrl;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
