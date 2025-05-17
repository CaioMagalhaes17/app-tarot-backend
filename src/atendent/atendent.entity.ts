import { BaseEntity } from 'src/core/base.entity';

type AvaliableServicesProps = {
  price: string;
  isActive: boolean;
  serviceId: string;
};

type AtendentProps = {
  avaliableServices: AvaliableServicesProps[];
  specialities: string[];
  userId: string;
};

export class AtendentEntity extends BaseEntity<AtendentProps> {
  static create(props: AtendentProps, id: string) {
    return new AtendentEntity(props, id);
  }

  get specialities(): string[] {
    return this.props.specialities;
  }

  get userId(): string {
    return this.props.userId;
  }

  get avaliableServices(): AvaliableServicesProps[] {
    return this.props.avaliableServices;
  }
}
