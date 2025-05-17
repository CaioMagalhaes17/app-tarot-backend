import { IServicesRepository } from '../database/services.repository.interface';

export class GetAllServicesUseCase {
  constructor(private readonly servicesRepository: IServicesRepository) {}

  async execute() {
    return await this.servicesRepository.findAll();
  }
}
