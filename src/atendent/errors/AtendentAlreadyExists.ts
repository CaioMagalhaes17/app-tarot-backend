import { UseCaseError } from 'src/core/base.errors';

export class AtendentAlreadyExists extends Error implements UseCaseError {
  constructor() {
    super('Você já possui uma conta de atendente!');
  }
}
