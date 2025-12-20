import { Either, left, right } from 'src/core/Either';
import { IPaymentOrderRepository } from '../../database/payment-order.repository.interface';
import { PaymentOrderNotFound } from '../../error/PaymentOrderNotFound';
import { EventGateway } from 'src/gateways/events/event.gateway';
import { Payment, MercadoPagoConfig } from 'mercadopago';

export class MercadoPagoPaymentSucceededUseCase {
  private payment: Payment;
  private client: MercadoPagoConfig;

  constructor(
    private paymentOrderRepository: IPaymentOrderRepository,
    private eventGateway: EventGateway,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });
    this.payment = new Payment(this.client);
  }

  async execute(
    paymentId: string,
  ): Promise<Either<PaymentOrderNotFound, null>> {
    try {
      // 1. Buscar o pagamento no Mercado Pago
      const mercadoPagoPayment = await this.payment.get({
        id: paymentId,
      });
      if (!mercadoPagoPayment || !mercadoPagoPayment.id) {
        return left(
          new PaymentOrderNotFound('Pagamento não encontrado no Mercado Pago'),
        );
      }

      // 2. Buscar o PaymentOrder usando o preference_id como externalId
      const paymentOrder = await this.paymentOrderRepository.findByExternalId(
        mercadoPagoPayment.metadata.external_id,
      );

      if (!paymentOrder) {
        return left(
          new PaymentOrderNotFound('Ordem de pagamento não encontrada'),
        );
      }

      // 3. Mapear o status do Mercado Pago
      const status = this.mapStatus(mercadoPagoPayment.status || '');

      // 4. Atualizar o status do PaymentOrder
      paymentOrder.updateStatus(status);
      await this.paymentOrderRepository.updateById(
        paymentOrder.id.toString(),
        paymentOrder,
      );

      // 5. Se o pagamento foi aprovado, publicar evento
      if (status === 'completed') {
        await this.eventGateway.publish({
          name: 'PaymentOrderSucceed',
          payload: paymentOrder,
          occurredAt: new Date(),
        });
      }

      return right(null);
    } catch (error: any) {
      console.log('LOGGER Mercado Pago Payment Error:', error);
      return left(
        new PaymentOrderNotFound(
          'Erro ao processar pagamento: ' + error.message,
        ),
      );
    }
  }

  private mapStatus(
    mercadoPagoStatus: string,
  ): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    switch (mercadoPagoStatus) {
      case 'approved':
        return 'completed';
      case 'pending':
      case 'in_process':
        return 'processing';
      case 'rejected':
      case 'cancelled':
        return 'failed';
      case 'refunded':
      case 'charged_back':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
}
