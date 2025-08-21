import { Either } from 'src/core/Either';
import { CreatePaymentOrderError } from './errors/CreatePaymentOrderError';

export interface PaymentOrder {
  externalId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
}

export abstract class PaymentGateway {
  abstract createPaymentOrder(
    userId: string,
    amount: number,
  ): Promise<Either<CreatePaymentOrderError, PaymentOrder>>;

  abstract getPaymentStatus(
    orderId: string,
  ): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'>;

  abstract getPaymentOrder(
    externalId: string,
  ): Promise<Either<Error, PaymentOrder>>;
}
