import { UseCaseError } from 'src/core/base.errors';

export class CreatePaymentOrderError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Erro ao criar ordem de pagamento.');
  }
}
