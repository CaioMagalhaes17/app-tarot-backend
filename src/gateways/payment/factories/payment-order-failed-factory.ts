import { FailedMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/failed-minutes-transaction';
import { Either } from 'src/core/Either';
import { PaymentOrderEntity } from 'src/payment/payment-order.entity';
import { ProductCategory } from 'src/products/product-entity';

type UseCase = {
  execute(paymentOrder: PaymentOrderEntity): Promise<Either<any, any>>;
};

export class PaymentOrderFailedFactory {
  constructor(
    private readonly failedMinutesTransactionUseCase: FailedMinutesTransactionUseCase,
  ) {}

  create(productType: ProductCategory): UseCase | null {
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
