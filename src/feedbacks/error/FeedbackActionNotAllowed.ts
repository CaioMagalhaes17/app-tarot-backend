import { UseCaseError } from 'src/core/base.errors';

export class FeedbackActionNotAllowed extends Error implements UseCaseError {
  constructor() {
    super('Você não possui permissões sobre este feedback');
  }
}
