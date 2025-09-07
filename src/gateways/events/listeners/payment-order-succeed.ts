import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../event.gateway';
import { PaymentOrderCompletedFactory } from 'src/gateways/payment/factories/payment-order-completed-factory';

@Injectable()
export class PaymentOrderSucceedListener {
  constructor(
    private paymentOrderCompletedFactory: PaymentOrderCompletedFactory,
  ) {}

  @OnEvent('PaymentOrderSucceed')
  async handlePaymentOrderSucceed(event: DomainEvent) {
    const useCase = this.paymentOrderCompletedFactory.create(
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
