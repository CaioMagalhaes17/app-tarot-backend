import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

type ServicesProps = {
  name: string;
  description: string;
  serviceImg: string;
};

export class ServicesEntity extends BaseEntity<ServicesProps> {
  static create(props: ServicesProps, id?: string) {
    return new ServicesEntity(props, new UniqueEntityID(id));
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get serviceImg(): string {
    return this.props.serviceImg;
  }
}
