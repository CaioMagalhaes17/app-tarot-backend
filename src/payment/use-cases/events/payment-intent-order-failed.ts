import { Either, left, right } from 'src/core/Either';
import { EventGateway } from 'src/gateways/events/event.gateway';
import { IPaymentOrderRepository } from 'src/payment/database/payment-order.repository.interface';
import { PaymentOrderNotFound } from 'src/payment/error/PaymentOrderNotFound';
import { PaymentFailedMessageFactory } from 'src/payment/factories/payment-failed-message.factory';
import { StripePaymentErrors } from 'src/webhooks/stripe-payment.webhook.controller';

export class PaymentIntentOrderFailedUseCase {
  constructor(
    private paymentOrderRepository: IPaymentOrderRepository,
    private paymentFailedMessageFactory: PaymentFailedMessageFactory,
    private eventGateway: EventGateway,
  ) {}

  async execute(
    externalId: string,
    payload: StripePaymentErrors,
  ): Promise<Either<PaymentOrderNotFound, null>> {
    const paymentOrder =
      await this.paymentOrderRepository.findByExternalId(externalId);
    if (!paymentOrder)
      return left(
        new PaymentOrderNotFound('Ordem de pagamento não encontrada'),
      );
    paymentOrder.updateStatus(
      'failed',
      this.paymentFailedMessageFactory.create(payload),
    );

    await this.paymentOrderRepository.updateById(
      paymentOrder.id.toString(),
      paymentOrder,
    );

    await this.eventGateway.publish({
      name: 'PaymentOrderFailed',
      payload: paymentOrder,
      occurredAt: new Date(),
    });
    return right(null);
  }
}
