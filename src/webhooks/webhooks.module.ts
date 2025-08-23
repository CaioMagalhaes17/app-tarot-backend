import { Module } from '@nestjs/common';
import { StripePaymentWebhookController } from './stripe-payment.webhook.controller';
import { StripeEventFactory } from './factories/stripe-payment-factory';
import { PaymentIntentSucceededUseCase } from 'src/payment/use-cases/payment-intent-order-succeeded';
import { PaymentOrderModule } from 'src/payment/payment-order.module';

@Module({
  imports: [PaymentOrderModule],
  controllers: [StripePaymentWebhookController],
  providers: [
    {
      provide: StripeEventFactory,
      useFactory: (
        paymentIntentSucceededUseCase: PaymentIntentSucceededUseCase,
      ) => {
        return new StripeEventFactory(paymentIntentSucceededUseCase);
      },
      inject: [PaymentIntentSucceededUseCase],
    },
  ],
})
export class WebhooksModule {}
