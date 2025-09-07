import { FailedMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/failed-minutes-transaction';
import { Either } from 'src/core/Either';
import {
  PaymentOrderEntity,
  ProductType,
} from 'src/payment/payment-order.entity';

type UseCase = {
  execute(paymentOrder: PaymentOrderEntity): Promise<Either<any, any>>;
};

export class PaymentOrderFailedFactory {
  constructor(
    private readonly failedMinutesTransactionUseCase: FailedMinutesTransactionUseCase,
  ) {}

  create(productType: ProductType): UseCase | null {
    switch (productType) {
      case 'minutes':
        return this.failedMinutesTransactionUseCase;
      default:
        console.warn(
          `⚠️ Nenhum use case configurado para o produto: ${productType}`,
        );
        return null;
    }
  }
}
