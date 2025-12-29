import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from 'src/gateways/events/event.gateway';
import { CreateNotificationUseCase } from '../use-cases/create-notification';
import { PaymentOrderEntity } from 'src/payment/payment-order.entity';

@Injectable()
export class PaymentApprovedListener {
  constructor(
    private createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  @OnEvent('PaymentOrderSucceed')
  async handlePaymentApproved(event: DomainEvent) {
    const paymentOrder = event.payload as PaymentOrderEntity;

    await this.createNotificationUseCase.execute({
      userId: paymentOrder.userId,
      type: 'payment_approved',
      title: 'Pagamento Aprovado',
      message: `Seu pagamento de R$ ${paymentOrder.amount.toFixed(2)} foi aprovado com sucesso!`,
      metadata: {
        paymentOrderId: paymentOrder.id.toString(),
        amount: paymentOrder.amount,
        productType: paymentOrder.productType,
      },
    });
  }
}

