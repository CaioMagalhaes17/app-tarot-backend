import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';
import { UserEntity } from 'src/user/user.entity';

type ClientMinutesProps = {
  transactions: {
    type: 'purchase' | 'usage' | 'refund' | 'bonus';
    minutes: number;
    date: Date;
    description?: string;
  }[];
  user: UserEntity;
  totalMinutes: number;
  avaliableMinutes: number;
};

export class ClientMinutesEntity extends BaseEntity<ClientMinutesProps> {
  static create(props: ClientMinutesProps, id?: string) {
    return new ClientMinutesEntity(props, new UniqueEntityID(id));
  }

  get transactions() {
    return this.props.transactions;
  }

  get user() {
    return this.props.user;
  }

  get totalMinutes() {
    return this.props.totalMinutes;
  }

  get avaliableMinutes() {
    return this.props.avaliableMinutes;
  }

  addTransaction(data: {
    type: 'purchase' | 'usage' | 'refund' | 'bonus';
    minutes: number;
    date: Date;
    description?: string;
  }) {
    if (data.type === 'purchase') {
      this.props.totalMinutes = this.props.totalMinutes + data.minutes;
      this.props.avaliableMinutes = this.props.avaliableMinutes + data.minutes;
      console.log(this.props.avaliableMinutes);
    }
    if (data.type === 'usage') {
      this.props.avaliableMinutes -= data.minutes;
    }
    if (data.type === 'refund') {
      this.props.totalMinutes -= data.minutes;
      this.props.avaliableMinutes -= data.minutes;
    }
    if (data.type === 'bonus') {
      this.props.avaliableMinutes += data.minutes;
    }
    this.transactions.push(data);
  }
}
