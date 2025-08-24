import { UseCaseError } from 'src/core/base.errors';

export class TransactionNotFound extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Transação de minutos não encontrada');
  }
}
