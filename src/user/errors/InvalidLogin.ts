import { UseCaseError } from 'src/core/base.errors';

export class InvalidLoginError extends Error implements UseCaseError {
  constructor() {
    super('Usuário ou senha inválidos.');
  }
}
