import { AtendentEntity } from 'src/atendent/atendent.entity';
import { BaseEntity } from 'src/core/base.entity';
import { Optional } from 'src/core/Either';
import { UniqueEntityID } from 'src/core/unique-entity-id';
import { ServicesEntity } from 'src/services/services.entity';

type AtendentServicesProps = {
  description: string;
  price: number;
  service: ServicesEntity;
  atendent: AtendentEntity;
  isActive?: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

export class AtendentServicesEntity extends BaseEntity<AtendentServicesProps> {
  static create(
    props: Optional<AtendentServicesProps, 'createdAt'>,
    id?: string,
  ) {
    return new AtendentServicesEntity(
      { isActive: props.isActive || true, createdAt: new Date(), ...props },
      new UniqueEntityID(id),
    );
  }

  get description(): string {
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get service() {
    return this.props.service;
  }

  get atendent() {
    return this.props.atendent;
  }

  get isActive() {
    return this.props.isActive;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  touch() {
    this.props.updatedAt = new Date();
  }

  inactivate() {
    this.props.isActive = false;
    this.touch();
  }

  update(props: Partial<AtendentServicesEntity>) {
    if (props.description !== undefined) {
      this.props.description = props.description;
    }
    if (props.price !== undefined) {
      this.props.price = props.price;
    }
    if (props.isActive !== undefined) {
      this.props.isActive = props.isActive;
    }
    this.touch();
  }
}
