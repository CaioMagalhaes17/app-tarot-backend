import { Either, right } from 'src/core/Either';
import { PaymentGateway } from 'src/gateways/payment/payment-gateway';
import { IPaymentOrderRepository } from '../database/payment-order.repository.interface';

export class PaymentIntentSucceededUseCase {
  constructor(
    private paymentOrderRepository: IPaymentOrderRepository,
    private paymentGateway: PaymentGateway,
  ) {}

  async execute(externalId: string): Promise<Either<any, any>> {
    console.log('chegou aqui XD');
    return right(null);
  }
}
