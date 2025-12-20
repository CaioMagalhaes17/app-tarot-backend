import { Module } from '@nestjs/common';
import { StripePaymentWebhookController } from './stripe-payment.webhook.controller';
import { StripeEventFactory } from './factories/stripe-payment-factory';
import { MercadoPagoWebhookController } from './mercado-pago.webhook.controller';
import { MercadoPagoEventFactory } from './factories/mercado-pago-event-factory';
import { PaymentIntentSucceededUseCase } from 'src/payment/use-cases/events/payment-intent-order-succeeded';
import { MercadoPagoPaymentSucceededUseCase } from 'src/payment/use-cases/events/mercado-pago-payment-succeeded';
import { PaymentOrderModule } from 'src/payment/payment-order.module';
import { PaymentIntentOrderFailedUseCase } from 'src/payment/use-cases/events/payment-intent-order-failed';
import { GatewaysModule } from 'src/gateways/gateways.module';
import { IPaymentOrderRepository } from 'src/payment/database/payment-order.repository.interface';
import { PaymentOrderRepository } from 'src/payment/database/payment-order.repository';
import { EventGateway } from 'src/gateways/events/event.gateway';
import { PaymentOrderDatabaseModule } from 'src/payment/database/payment-oder.module';

@Module({
  imports: [PaymentOrderModule, GatewaysModule, PaymentOrderDatabaseModule],
  controllers: [StripePaymentWebhookController, MercadoPagoWebhookController],
  providers: [
    {
      provide: StripeEventFactory,
      useFactory: (
        paymentIntentSucceededUseCase: PaymentIntentSucceededUseCase,
        paymentIntentOrderFailedUseCase: PaymentIntentOrderFailedUseCase,
      ) => {
        return new StripeEventFactory(
          paymentIntentSucceededUseCase,
          paymentIntentOrderFailedUseCase,
        );
      },
      inject: [PaymentIntentSucceededUseCase, PaymentIntentOrderFailedUseCase],
    },
    {
      provide: MercadoPagoPaymentSucceededUseCase,
      useFactory: (
        paymentOrderRepository: IPaymentOrderRepository,
        eventGateway: EventGateway,
      ) => {
        return new MercadoPagoPaymentSucceededUseCase(
          paymentOrderRepository,
          eventGateway,
        );
      },
      inject: [PaymentOrderRepository, EventGateway],
    },
    {
      provide: MercadoPagoEventFactory,
      useFactory: (
        mercadoPagoPaymentSucceededUseCase: MercadoPagoPaymentSucceededUseCase,
        paymentIntentOrderFailedUseCase: PaymentIntentOrderFailedUseCase,
      ) => {
        return new MercadoPagoEventFactory(
          mercadoPagoPaymentSucceededUseCase,
          paymentIntentOrderFailedUseCase,
        );
      },
      inject: [
        MercadoPagoPaymentSucceededUseCase,
        PaymentIntentOrderFailedUseCase,
      ],
    },
  ],
})
export class WebhooksModule {}
