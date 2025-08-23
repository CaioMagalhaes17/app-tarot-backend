import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEvent } from '../event.gateway';

@Injectable()
export class PaymentIntentCreatedListener {
  @OnEvent('PaymentIntentCreated')
  handlePaymentIntentCreated(event: DomainEvent) {
    console.log('📢 Evento recebido:', event);
  }
}
