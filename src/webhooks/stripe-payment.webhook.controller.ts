import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { StripeEventFactory } from './factories/stripe-payment-factory';

export type StripePaymentErrors = {
  code: 'card_declined';
  message:
  | 'Your card was declined.'
  | 'Your card has insufficient funds.'
  | 'Error';
  payment_method: {
    card: {
      brand: 'visa';
      last4: string;
    };
  };
  type: 'card_error';
};
export interface StripeWebhookDTO {
  id: string;
  object: string;
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      last_payment_error: StripePaymentErrors;
      [key: string]: any;
    };
  };
  [key: string]: any;
}

@Controller('webhooks/stripe')
export class StripePaymentWebhookController {
  constructor(private stripeEventFactory: StripeEventFactory) {}

  @Post()
  async execute(@Req() req: Request) {
    const event = req.body as StripeWebhookDTO;
    const useCase = this.stripeEventFactory.create(event.type);
    if (useCase) {
      const response = await useCase.execute(
        event.data.object.id,
        event.data.object.last_payment_error,
      );
      if (response.isLeft()) {
        console.log('LOGGER', response.value);
      }
    }
  }
}
