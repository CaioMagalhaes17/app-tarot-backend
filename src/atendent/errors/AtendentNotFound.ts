import { UseCaseError } from 'src/core/base.errors';

export class AtendentNotFound extends Error implements UseCaseError {
  constructor() {
    super('Atendente não encontrado');
  }
}
