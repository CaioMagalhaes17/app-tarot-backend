import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';
import { PaymentOrderEntity } from 'src/payment/payment-order.entity';
import { UserEntity } from 'src/user/user.entity';

export type MinutesTransaction = {
  type: 'purchase' | 'usage' | 'refund' | 'bonus';
  minutes: number;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
  paymentOrder: PaymentOrderEntity;
  description?: string;
};

export type ClientMinutesProps = {
  transactions: MinutesTransaction[];
  user: UserEntity;
  totalMinutes: number;
  avaliableMinutes: number;
  createdAt: Date;
  updatedAt?: Date;
};

export class ClientMinutesEntity extends BaseEntity<ClientMinutesProps> {
  static create(props: ClientMinutesProps, id?: string) {
    return new ClientMinutesEntity(props, new UniqueEntityID(id));
  }

  get transactions() {
    return this.props.transactions;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
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

  addMinutesPurchased(transactionIndex: number) {
    this.props.totalMinutes =
      this.props.totalMinutes +
      this.props.transactions[transactionIndex].minutes;
    this.props.avaliableMinutes =
      this.props.avaliableMinutes +
      this.props.transactions[transactionIndex].minutes;
    this.props.transactions[transactionIndex].status = 'completed';
    this.touch();
  }

  discountMinutes(transactionIndex: number, type: 'usage' | 'refund') {
    if (type === 'usage') {
      this.props.avaliableMinutes -=
        this.props.transactions[transactionIndex].minutes;
    }
    if (type === 'refund') {
      this.props.totalMinutes -=
        this.props.transactions[transactionIndex].minutes;
      this.props.avaliableMinutes -=
        this.props.transactions[transactionIndex].minutes;
    }
    this.touch();
  }

  applyBonus(transactionIndex: number) {
    this.props.avaliableMinutes +=
      this.props.transactions[transactionIndex].minutes;
  }

  createTransaction(data: MinutesTransaction) {
    this.transactions.push(data);
  }

  touch() {
    this.props.updatedAt = new Date();
  }
}
