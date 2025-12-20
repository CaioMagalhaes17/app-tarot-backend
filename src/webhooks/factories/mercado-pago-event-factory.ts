import { Either } from 'src/core/Either';
import { MercadoPagoPaymentSucceededUseCase } from 'src/payment/use-cases/events/mercado-pago-payment-succeeded';
import { PaymentIntentOrderFailedUseCase } from 'src/payment/use-cases/events/payment-intent-order-failed';

type UseCase = {
  execute(externalId: string, payload?: any): Promise<Either<any, any>>;
};

export class MercadoPagoEventFactory {
  constructor(
    private readonly mercadoPagoPaymentSucceeded: MercadoPagoPaymentSucceededUseCase,
    private readonly paymentFailed: PaymentIntentOrderFailedUseCase,
  ) {}

  create(type: string): UseCase | null {
    switch (type) {
      case 'payment':
        // Para Mercado Pago, o tipo 'payment' indica um pagamento
        // O status será verificado no use case
        return this.mercadoPagoPaymentSucceeded;
      case 'merchant_order':
        // Merchant order também pode ser usado para verificar pagamentos
        return this.mercadoPagoPaymentSucceeded;
      default:
        console.warn(
          `⚠️ Nenhum use case configurado para o evento do Mercado Pago: ${type}`,
        );
        return null;
    }
  }
}
