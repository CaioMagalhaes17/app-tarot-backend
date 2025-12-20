import { Either } from 'src/core/Either';
import { CreatePaymentOrderError } from './errors/CreatePaymentOrderError';
import { ProductCategory } from 'src/payment/payment-order.entity';

export interface PaymentOrder {
  externalId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  checkoutUrl: string; // URL para redirecionar o cliente (Checkout Pro)
}

export abstract class PaymentGateway {
  abstract createPaymentOrder(
    userId: string,
    amount: number,
    productType?: ProductCategory,
  ): Promise<Either<CreatePaymentOrderError, PaymentOrder>>;

  abstract getPaymentStatus(
    orderId: string,
  ): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'>;

  abstract getPaymentOrder(
    externalId: string,
  ): Promise<Either<Error, PaymentOrder>>;
}
