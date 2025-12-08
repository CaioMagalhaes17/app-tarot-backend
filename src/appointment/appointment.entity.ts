import { AtendentServicesEntity } from 'src/atendent-services/atendent-services.entity';
import { BaseEntity } from 'src/core/base.entity';
import { Optional } from 'src/core/Either';
import { UniqueEntityID } from 'src/core/unique-entity-id';
import { UserEntity } from 'src/user/user.entity';

export type AppointmentProps = {
  atendentService: AtendentServicesEntity;
  user: UserEntity;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'canceled';
  createdAt: Date;
  updatedAt?: Date;
};

export class AppointmentEntity extends BaseEntity<AppointmentProps> {
  static create(props: Optional<AppointmentProps, 'createdAt'>, id?: string) {
    return new AppointmentEntity(
      { createdAt: props.createdAt || new Date(), ...props },
      new UniqueEntityID(id),
    );
  }

  get status() {
    return this.props.status;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get atendentService() {
    return this.props.atendentService;
  }

  get date() {
    return this.props.date;
  }

  get startTime() {
    return this.props.startTime;
  }

  get endTime() {
    return this.props.endTime;
  }

  get user() {
    return this.props.user;
  }
}
