import { Module } from '@nestjs/common';
import { PaymentGateway } from './payment/payment-gateway';
import { StripeGateway } from './payment/stripe-gateway';
import { EventGateway } from './events/event.gateway';
import { EventEmitter } from 'stream';
import { PaymentIntentCreatedListener } from './events/listeners/payment-created';

@Module({
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripeGateway,
    },
    {
      provide: EventGateway,
      useClass: EventEmitter,
    },
    PaymentIntentCreatedListener,
  ],
  exports: [PaymentGateway, EventGateway],
})
export class GatewaysModule {}
