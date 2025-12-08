import { Either, left, right } from 'src/core/Either';
import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found';

type UpdateAtendentServiceUseCaseRequest = {
  price?: number;
  description?: string;
};
export class UpdateAtendentServiceUseCase {
  constructor(
    private atendentServicesRepository: IAtendentServicesRepository,
  ) {}

  async execute(
    atendentServiceId: string,
    props: UpdateAtendentServiceUseCaseRequest,
  ): Promise<Either<ResourceNotFoundError, null>> {
    const atendentService =
      await this.atendentServicesRepository.findById(atendentServiceId);
    if (!atendentService)
      return left(new ResourceNotFoundError('Serviço não encontrado'));
    atendentService.update(props);
    await this.atendentServicesRepository.updateById(
      atendentServiceId,
      atendentService,
    );
    return right(null);
  }
}
