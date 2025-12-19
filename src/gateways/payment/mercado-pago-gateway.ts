import { Injectable } from '@nestjs/common';
import { PaymentGateway, PaymentOrder } from './payment-gateway';
import { Either, left, right } from 'src/core/Either';
import { CreatePaymentOrderError } from './errors/CreatePaymentOrderError';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoGateway extends PaymentGateway {
  private client: MercadoPagoConfig;
  private preference: Preference;

  constructor() {
    super();
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
    });
    this.preference = new Preference(this.client);
  }

  async createPaymentOrder(
    userId: string,
    amount: number,
    description?: string,
  ): Promise<Either<CreatePaymentOrderError, PaymentOrder>> {
    try {
      const backUrls = {
        success: process.env.MERCADO_PAGO_SUCCESS_URL || '',
        failure: process.env.MERCADO_PAGO_FAILURE_URL || '',
        pending: process.env.MERCADO_PAGO_PENDING_URL || '',
      };

      const preferenceData = {
        items: [
          {
            id: `item_${Date.now()}_${userId}`,
            title: description || 'Pagamento',
            quantity: 1,
            unit_price: amount,
            currency_id: 'BRL',
          },
        ],
        back_urls: backUrls,
        auto_return: 'approved' as const,
        notification_url: process.env.MERCADO_PAGO_WEBHOOK_URL || '',
        metadata: {
          userId,
        },
      };

      const response = await this.preference.create({ body: preferenceData });

      if (!response.init_point || !response.id) {
        return left(
          new CreatePaymentOrderError(
            'Erro ao criar preferência de pagamento no Mercado Pago',
          ),
        );
      }

      return right({
        amount,
        status: 'pending',
        createdAt: new Date(),
        externalId: response.id,
        checkoutUrl: response.init_point,
      });
    } catch (error: any) {
      console.log('LOGGER Mercado Pago Error:', error);
      return left(
        new CreatePaymentOrderError(
          'Erro ao criar ordem de pagamento no Mercado Pago: ' +
          (error.message || 'Erro desconhecido'),
        ),
      );
    }
  }

  async getPaymentOrder(
    externalId: string,
  ): Promise<Either<Error, PaymentOrder>> {
    try {
      const response = await this.preference.get({ preferenceId: externalId });

      return right({
        amount: response.items?.[0]?.unit_price || 0,
        status: 'pending', // Status será atualizado via webhook
        createdAt: new Date(),
        externalId: response.id || '',
        checkoutUrl: response.init_point || '',
      });
    } catch (error: any) {
      return left(
        new Error('Erro ao buscar ordem de pagamento: ' + error.message),
      );
    }
  }

  async getPaymentStatus(
    orderId: string,
  ): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'> {
    // No Mercado Pago, o status é obtido via webhook
    // Este método pode ser usado para consultar o status se necessário
    return 'pending';
  }

  /**
   * Mapeia o status do pagamento do Mercado Pago para o status interno
   */
  mapStatus(
    mercadoPagoStatus: string,
  ): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    switch (mercadoPagoStatus) {
      case 'approved':
        return 'completed';
      case 'pending':
      case 'in_process':
        return 'processing';
      case 'rejected':
      case 'cancelled':
        return 'failed';
      case 'refunded':
      case 'charged_back':
        return 'cancelled';
      default:
        return 'pending';
    }
  }
}
