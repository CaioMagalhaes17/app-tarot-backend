import { BaseEntity } from 'src/core/base.entity';
import { UniqueEntityID } from 'src/core/unique-entity-id';

export type ErrorDescription =
  | 'Cartão recusado'
  | 'Saldo insuficiente'
  | 'Erro não tratado';
export type OrderType = 'payment' | 'withdrawal';
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

// ProductCategory moved here - products module removed
export type ProductCategory = 'appointment';

export interface PaymentOrderEntityProps {
  userId: string;
  type: OrderType;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  productType: ProductCategory;
  updatedAt?: Date;
  description?: string;
  errorDescription?: ErrorDescription;
  externalId?: string;
  paymentMethod?: string;
  withdrawlMethod?: string;
}

export class PaymentOrderEntity extends BaseEntity<PaymentOrderEntityProps> {
  static create(props: PaymentOrderEntityProps, id?: string) {
    return new PaymentOrderEntity(props, new UniqueEntityID(id));
  }

  get userId() {
    return this.props.userId;
  }

  get productType() {
    return this.props.productType;
  }

  get type() {
    return this.props.type;
  }

  get amount() {
    return this.props.amount;
  }

  get status() {
    return this.props.status;
  }

  get errorDescription() {
    return this.props.errorDescription;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get description() {
    return this.props.description;
  }

  get externalId() {
    return this.props.externalId;
  }

  get paymentMethod() {
    return this.props.paymentMethod;
  }

  get withdrawlMethod() {
    return this.props.withdrawlMethod;
  }

  cleanErrors() {
    this.props.errorDescription = undefined;
    this.touch();
  }

  updateStatus(status: OrderStatus, errorDescription?: ErrorDescription) {
    this.props.status = status;
    if (errorDescription) {
      this.props.errorDescription = errorDescription;
    }
    this.touch();
  }

  touch() {
    this.props.updatedAt = new Date();
  }
}
