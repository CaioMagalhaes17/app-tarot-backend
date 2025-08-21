import { Either, left, right } from 'src/core/Either';
import { CreatePaymentOrderError } from '../errors/CreatePaymentOrderError';
import { PaymentGateway, PaymentOrder } from '../payment-gateway';
import { randomUUID } from 'crypto';

export class InMemoryPaymentGateway implements PaymentGateway {
  paymentOrders: PaymentOrder[] = [];
  async createPaymentOrder(
    userId: string,
    amount: number,
  ): Promise<Either<CreatePaymentOrderError, PaymentOrder>> {
    if (amount < 5)
      return left(new CreatePaymentOrderError('amount is too low'));
    const response: PaymentOrder = {
      amount,
      createdAt: new Date(),
      externalId: randomUUID(),
      status: 'pending',
    };
    this.paymentOrders.push(response);
    return right(response);
  }

  async getPaymentStatus(
    externalId: string,
  ): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'> {
    return 'pending';
  }

  async getPaymentOrder(
    externalId: string,
  ): Promise<Either<Error, PaymentOrder>> {
    const topicIndex = this.paymentOrders.findIndex(
      (item) => item.externalId === externalId,
    );
    if (!this.paymentOrders[topicIndex])
      return left(Error('Payment order not found'));
    return right(this.paymentOrders[topicIndex]);
  }
}
