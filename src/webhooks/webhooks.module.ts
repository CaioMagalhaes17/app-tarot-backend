import { Module } from '@nestjs/common';
import { StripePaymentWebhookController } from './stripe-payment.webhook.controller';
import { StripeEventFactory } from './factories/stripe-payment-factory';
import { PaymentIntentSucceededUseCase } from 'src/payment/use-cases/events/payment-intent-order-succeeded';
import { PaymentOrderModule } from 'src/payment/payment-order.module';
import { PaymentIntentOrderFailedUseCase } from 'src/payment/use-cases/events/payment-intent-order-failed';

@Module({
  imports: [PaymentOrderModule],
  controllers: [StripePaymentWebhookController],
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
  ],
})
export class WebhooksModule {}
