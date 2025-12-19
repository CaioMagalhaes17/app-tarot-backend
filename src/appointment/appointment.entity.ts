import { AtendentServicesEntity } from 'src/atendent-services/atendent-services.entity';
import { BaseEntity } from 'src/core/base.entity';
import { Optional } from 'src/core/Either';
import { UniqueEntityID } from 'src/core/unique-entity-id';
import { UserEntity } from 'src/user/user.entity';

export enum AppointmentStatusEnum {
  SCHEDULED = 'scheduled',
  ON_GOING = 'on-going',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export type AppointmentStatus =
  | 'scheduled'
  | 'on-going'
  | 'completed'
  | 'canceled';

export type AppointmentProps = {
  atendentService: AtendentServicesEntity;
  user: UserEntity;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  paymentOrderId?: string;
  canceledReason?: string;
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

  get canceledReason() {
    return this.props.canceledReason;
  }

  get paymentOrderId() {
    return this.props.paymentOrderId;
  }

  touch() {
    this.props.updatedAt = new Date();
  }

  updateAppointment(props: Partial<AppointmentEntity>) {
    if (props.date) {
      this.props.date = props.date;
    }

    if (props.startTime) {
      this.props.startTime = props.startTime;
    }

    if (props.endTime) {
      this.props.endTime = props.endTime;
    }

    if (props.status) {
      this.props.status = props.status;
    }

    if (props.canceledReason) {
      this.props.canceledReason = props.canceledReason;
    }

    this.touch();
  }
}
