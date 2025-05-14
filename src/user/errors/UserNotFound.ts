import { UseCaseError } from 'src/core/base.errors';

export class UserNotFound extends Error implements UseCaseError {
  constructor() {
    super('Usuário não encontrado');
  }
}
