import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentGateway, PaymentOrder } from './payment-gateway';
import { Either, left, right } from 'src/core/Either';
import { CreatePaymentOrderError } from './errors/CreatePaymentOrderError';

@Injectable()
export class StripeGateway extends PaymentGateway {
  private stripe: Stripe;

  constructor() {
    super();
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createPaymentOrder(
    userId: string,
    amount: number,
  ): Promise<Either<CreatePaymentOrderError, PaymentOrder>> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'brl',
        metadata: { userId },
        description: 'Compra de minutos',
      });

      return right({
        amount,
        status: this.mapStatus(paymentIntent.status),
        createdAt: new Date(),
        externalId: paymentIntent.id,
      });
    } catch (error) {
      console.log(error.raw.code, error.raw.message);
      return left(
        new CreatePaymentOrderError(
          'Erro ao criar ordem de pagamento na Stripe',
        ),
      );
    }
  }

  async getPaymentOrder(
    externalId: string,
  ): Promise<Either<Error, PaymentOrder>> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(externalId);
    console.log(paymentIntent);
    return right({
      amount: paymentIntent.amount,
      status: this.mapStatus(paymentIntent.status),
      createdAt: new Date(),
      externalId: paymentIntent.id,
    });
  }

  async getPaymentStatus(
    orderId: string,
  ): Promise<'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(orderId);
    return this.mapStatus(paymentIntent.status);
  }

  private mapStatus(
    stripeStatus: string,
  ): 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' {
    switch (stripeStatus) {
      case 'requires_payment_method':
        return 'pending';
      case 'requires_confirmation':
        return 'processing';
      case 'requires_action':
        return 'processing';
      case 'processing':
        return 'processing';
      case 'requires_capture':
        return 'processing';
      case 'canceled':
        return 'cancelled';
      case 'succeeded':
        return 'completed';
      default:
        return 'failed';
    }
  }
}
