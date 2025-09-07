import { StripePaymentErrors } from 'src/webhooks/stripe-payment.webhook.controller';
import { ErrorDescription } from '../payment-order.entity';

export class PaymentFailedMessageFactory {
  create(error: StripePaymentErrors): ErrorDescription {
    console.log(error.message);
    switch (error.message) {
      case 'Your card was declined.':
        return 'Cartão recusado';
      case 'Your card has insufficient funds.':
        return 'Saldo insuficiente';
      default:
        return 'Erro não tratado';
    }
  }
}
