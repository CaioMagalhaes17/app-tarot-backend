import { UseCaseError } from 'src/core/base.errors';

export class LoginAlreadyExists extends Error implements UseCaseError {
  constructor() {
    super('Login já existe.');
  }
}
