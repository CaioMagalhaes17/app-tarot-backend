import { UseCaseError } from 'src/core/base.errors';

export class AtendentAlreadyChoosedServiceError
  extends Error
  implements UseCaseError {
  constructor(message?: string) {
    super(message || 'Você já escolheu esse serviço');
  }
}
