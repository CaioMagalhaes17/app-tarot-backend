import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../event.gateway';
import { PaymentOrderFailedFactory } from 'src/gateways/payment/factories/payment-order-failed-factory';

@Injectable()
export class PaymentOrderFailedListener {
  constructor(private paymentOrderFailedFactory: PaymentOrderFailedFactory) {}

  @OnEvent('PaymentOrderFailed')
  async handlePaymentOrderFailed(event: DomainEvent) {
    const useCase = this.paymentOrderFailedFactory.create(
      event.payload.productType,
    );

    if (useCase) {
      const response = await useCase.execute(event.payload);
      if (response.isLeft()) {
        console.log('LOGGER', response.value);
      }
    }
  }
}
