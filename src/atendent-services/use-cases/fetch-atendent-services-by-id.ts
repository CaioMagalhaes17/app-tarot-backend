import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';

export class FetchAtendentServiceByIdUseCase {
  constructor(
    private atendentServicesRepository: IAtendentServicesRepository,
  ) {}

  async execute(id: string) {
    return await this.atendentServicesRepository.findById(id);
  }
}
