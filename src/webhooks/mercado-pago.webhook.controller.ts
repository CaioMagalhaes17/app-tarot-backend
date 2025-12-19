import { Controller, Post, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { MercadoPagoEventFactory } from './factories/mercado-pago-event-factory';

export interface MercadoPagoWebhookDTO {
  type: string;
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
    const useCase = this.mercadoPagoEventFactory.create(event.type);
    if (useCase) {
      const response = await useCase.execute(event.data.id);
      if (response.isLeft()) {
        console.log('LOGGER Mercado Pago Webhook Error:', response.value);
      }
    }
  }
}

