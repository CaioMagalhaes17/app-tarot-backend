import { Either } from 'src/core/Either';
import { PaymentIntentSucceededUseCase } from 'src/payment/use-cases/payment-intent-order-succeeded';

type UseCase = { execute(externalId: string): Promise<Either<any, any>> };

export class StripeEventFactory {
  constructor(
    private readonly paymentIntentSucceeded: PaymentIntentSucceededUseCase,
  ) {}

  create(type: string): UseCase | null {
    switch (type) {
      case 'payment_intent.succeeded':
        return this.paymentIntentSucceeded;
      case 'charge.succeeded':
        return this.paymentIntentSucceeded;

      default:
        console.warn(`⚠️ Nenhum use case configurado para o evento: ${type}`);
        return null;
    }
  }
}
