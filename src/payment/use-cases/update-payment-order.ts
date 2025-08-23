import { PaymentGateway } from 'src/gateways/payment/payment-gateway';
import { IPaymentOrderRepository } from '../database/payment-order.repository.interface';
import { Either, left, right } from 'src/core/Either';
import { PaymentOrderNotFound } from '../error/PaymentOrderNotFound';

export class UpdatePaymentOrderUseCase {
  constructor(
    private paymentOrderRepository: IPaymentOrderRepository,
    private paymentGateway: PaymentGateway,
  ) {}

  async execute(
    externalId: string,
  ): Promise<Either<Error | PaymentOrderNotFound, null>> {
    const gatewayOrder = await this.paymentGateway.getPaymentOrder(externalId);
    if (gatewayOrder.isLeft())
      return left(new Error(gatewayOrder.value.message));
    console.log(gatewayOrder);
    const paymentOrder =
      await this.paymentOrderRepository.findByExternalId(externalId);
    if (!paymentOrder) return left(new PaymentOrderNotFound());
    paymentOrder.update(gatewayOrder.value.status);
    await this.paymentOrderRepository.updateById(
      paymentOrder.id.toString(),
      paymentOrder,
    );
    return right(null);
  }
}
