import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { StripeEventFactory } from './factories/stripe-payment-factory';

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
      // adicione outros campos que você precisa
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
      const response = await useCase.execute(event.data.object.id);
      if (response.isLeft()) {
        console.log('LOGGER', response.value);
      }
    }
  }
}
