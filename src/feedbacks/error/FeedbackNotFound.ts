import { UseCaseError } from 'src/core/base.errors';

export class FeedbackNotFound extends Error implements UseCaseError {
  constructor() {
    super('Feedback não encontrado');
  }
}
