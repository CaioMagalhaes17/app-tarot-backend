// ClientMinutesModule removed - module is no longer used
// import { FailedMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/failed-minutes-transaction';
import { Either } from 'src/core/Either';
import { PaymentOrderEntity, ProductCategory } from 'src/payment/payment-order.entity';

type UseCase = {
  execute(paymentOrder: PaymentOrderEntity): Promise<Either<any, any>>;
};

export class PaymentOrderFailedFactory {
  constructor(
    // ClientMinutesModule removed - no longer using FailedMinutesTransactionUseCase
    private readonly failedMinutesTransactionUseCase: any = null,
  ) {}

  create(productType: ProductCategory): UseCase | null {
    switch (productType) {
      case 'appointment':
        // Future: Add appointment failure logic here if needed
        return null;
      default:
        console.warn(
          `⚠️ Nenhum use case configurado para o produto: ${productType}`,
        );
        return null;
    }
  }
}
