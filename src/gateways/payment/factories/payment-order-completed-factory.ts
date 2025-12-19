// ClientMinutesModule removed - module is no longer used
// import { AddMinutesTransactionUseCase } from 'src/client-minutes/use-cases/events/add-minutes-transaction';
import { Either } from 'src/core/Either';
import { PaymentOrderEntity, ProductCategory } from 'src/payment/payment-order.entity';
import { ProcessAppointmentPaymentUseCase } from 'src/appointment/use-cases/process-appointment-payment';

type UseCase = {
  execute(paymentOrder: PaymentOrderEntity): Promise<Either<any, any>>;
};

export class PaymentOrderCompletedFactory {
  constructor(
    // ClientMinutesModule removed - no longer using AddMinutesTransactionUseCase
    private readonly addMinutesTransactionUseCase: any = null,
    private readonly processAppointmentPaymentUseCase?: ProcessAppointmentPaymentUseCase,
  ) {}

  create(productType: ProductCategory): UseCase | null {
    switch (productType) {
      case 'appointment':
        if (this.processAppointmentPaymentUseCase) {
          return {
            execute: async (paymentOrder: PaymentOrderEntity) => {
              return this.processAppointmentPaymentUseCase.execute(
                paymentOrder.id.toString(),
              );
            },
          };
        }
        console.warn(
          '⚠️ ProcessAppointmentPaymentUseCase não está configurado',
        );
        return null;
      default:
        console.warn(
          `⚠️ Nenhum use case configurado para o produto: ${productType}`,
        );
        return null;
    }
  }
}
