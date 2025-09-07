import { Either } from 'src/core/Either';
import { PaymentIntentOrderFailedUseCase } from 'src/payment/use-cases/events/payment-intent-order-failed';
import { PaymentIntentSucceededUseCase } from 'src/payment/use-cases/events/payment-intent-order-succeeded';

type UseCase = {
  execute(externalId: string, payload?: any): Promise<Either<any, any>>;
};

export class StripeEventFactory {
  constructor(
    private readonly paymentIntentSucceeded: PaymentIntentSucceededUseCase,
    private readonly paymentIntentOrderFailedUseCase: PaymentIntentOrderFailedUseCase,
  ) {}

  create(type: string): UseCase | null {
    switch (type) {
      case 'payment_intent.succeeded':
        return this.paymentIntentSucceeded;
      case 'payment_intent.payment_failed':
        return this.paymentIntentOrderFailedUseCase;

      default:
        console.warn(`⚠️ Nenhum use case configurado para o evento: ${type}`);
        return null;
    }
  }
}
