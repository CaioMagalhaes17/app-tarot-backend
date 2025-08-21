import { UseCaseError } from 'src/core/base.errors';

export class PaymentOrderNotFound extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Ordem de pagamento não encontrada em nosso sistema');
  }
}
