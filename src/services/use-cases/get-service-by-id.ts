import { IServicesRepository } from '../database/services.repository.interface';

export class GetServiceByIdUseCase {
  constructor(private readonly servicesRepository: IServicesRepository) {}

  async execute(id: string) {
    return await this.servicesRepository.findById(id);
  }
}
