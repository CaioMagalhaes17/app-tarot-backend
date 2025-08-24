import { UseCaseError } from 'src/core/base.errors';

export class MinutesNotFound extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'O usuário não possui histórico de minutos criado');
  }
}
