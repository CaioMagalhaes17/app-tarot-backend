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
    const eventData = {
      status: event.data.object.status,
    };
    const response = await useCase.execute(event.data.object.id);

    console.log(event.type, event.data.object.status, event.data.object);
    // console.log('Evento recebido:', event.type);
    // console.log('ID do objeto:', event.data.object.id);
  }

  @Get()
  async executes() {
    return { asddas: 'diosandoias' };
  }
}
