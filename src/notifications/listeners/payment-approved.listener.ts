import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from 'src/gateways/events/event.gateway';
import { CreateNotificationUseCase } from '../use-cases/create-notification';
import { PaymentOrderEntity } from 'src/payment/payment-order.entity';
import { INotificationRepository } from '../database/notification.repository.interface';
import { NotificationRepository } from '../database/notification.repository';
import { NotificationGateway } from '../gateways/notification.gateway';

@Injectable()
export class PaymentApprovedListener {
  constructor(
    private createNotificationUseCase: CreateNotificationUseCase,
    private notificationRepository: INotificationRepository,
    private notificationGateway: NotificationGateway,
  ) {}

  @OnEvent('PaymentOrderSucceed')
  async handlePaymentApproved(event: DomainEvent) {
    const paymentOrder = event.payload as PaymentOrderEntity;
    const paymentOrderId = paymentOrder.id.toString();

    // Verifica se já existe uma notificação para este pagamento
    const existingNotification =
      await this.notificationRepository.findByPaymentOrderId(
        paymentOrderId,
        'payment_approved',
      );

    // Se já existe, não cria outra notificação
    if (existingNotification) {
      return;
    }

    const result = await this.createNotificationUseCase.execute({
      userId: paymentOrder.userId,
      type: 'payment_approved',
      title: 'Pagamento Aprovado',
      message: `Seu pagamento de R$ ${paymentOrder.amount.toFixed(2)} foi aprovado com sucesso!`,
      metadata: {
        paymentOrderId,
        amount: paymentOrder.amount,
        productType: paymentOrder.productType,
      },
    });

    if (result.isRight()) {
      // Emite notificação via WebSocket para o usuário
      this.notificationGateway.emitNotificationToUser(
        paymentOrder.userId,
        result.value.notification,
      );
    }
  }
}

