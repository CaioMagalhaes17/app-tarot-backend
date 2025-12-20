import { Controller, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { MercadoPagoEventFactory } from './factories/mercado-pago-event-factory';

export interface MercadoPagoWebhookDTO {
  type?: string;
  topic?: string;
  resource?: string;
  data: {
    id: string;
  };
  [key: string]: any;
}

@Controller('webhooks/mercado-pago')
export class MercadoPagoWebhookController {
  constructor(private mercadoPagoEventFactory: MercadoPagoEventFactory) {}

  @Post()
  async execute(@Req() req: Request, @Body() body: MercadoPagoWebhookDTO) {
    const event = body;
    const type = event.topic || event.type;
    const paymentId = event.resource || event.data.id;
    const useCase = this.mercadoPagoEventFactory.create(type);
    if (useCase) {
      const response = await useCase.execute(paymentId);
      if (response.isLeft()) {
        console.log('LOGGER Mercado Pago Webhook Error:', response.value);
      }
    }
  }
}
