import { BaseEntity } from 'src/core/base.entity';

type ServicesProps = {
  name: string;
  description: string;
  serviceImg: string;
};

export class ServicesEntity extends BaseEntity<ServicesProps> {
  static create(props: ServicesProps, id: string) {
    return new ServicesEntity(props, id);
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
