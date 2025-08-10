import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';
import { UserEntity } from 'src/user/user.entity';

type AvaliableServicesProps = {
  price: string;
  isActive: boolean;
  serviceId: string;
};

type AtendentProps = {
  avaliableServices: AvaliableServicesProps[];
  specialities: string[];
  userId: string;
  user: UserEntity;
};

export class AtendentEntity extends BaseEntity<AtendentProps> {
  static create(props: AtendentProps, id?: string) {
    return new AtendentEntity(props, new UniqueEntityID(id));
  }

  get specialities(): string[] {
    return this.props.specialities;
  }

  get userId(): string {
    return this.props.userId;
  }

  get user(): UserEntity {
    return this.props.user;
  }

  get avaliableServices(): AvaliableServicesProps[] {
    return this.props.avaliableServices;
  }

  update(data: Partial<AtendentEntity>) {
    if (data.avaliableServices) {
      this.props.avaliableServices = data.avaliableServices;
    }
    if (data.specialities) {
      this.props.specialities = data.specialities;
    }
  }
}
