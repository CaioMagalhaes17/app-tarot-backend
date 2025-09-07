import { Either, left, right } from 'src/core/Either';
import { IPaymentOrderRepository } from '../../database/payment-order.repository.interface';
import { PaymentOrderNotFound } from '../../error/PaymentOrderNotFound';
import { EventGateway } from 'src/gateways/events/event.gateway';

export class PaymentIntentSucceededUseCase {
  constructor(
    private paymentOrderRepository: IPaymentOrderRepository,
    private eventGateway: EventGateway,
  ) {}

  async execute(
    externalId: string,
  ): Promise<Either<PaymentOrderNotFound, null>> {
    const paymentOrder =
      await this.paymentOrderRepository.findByExternalId(externalId);
    if (!paymentOrder)
      return left(
        new PaymentOrderNotFound('Ordem de pagamento não encontrada'),
      );
    paymentOrder.updateStatus('completed');
    await this.paymentOrderRepository.updateById(
      paymentOrder.id.toString(),
      paymentOrder,
    );

    await this.eventGateway.publish({
      name: 'PaymentOrderSucceed',
      payload: paymentOrder,
      occurredAt: new Date(),
    });

    return right(null);
  }
}
