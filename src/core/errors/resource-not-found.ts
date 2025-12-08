import { UseCaseError } from 'src/core/base.errors';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Recurso não encontrado!');
  }
}
