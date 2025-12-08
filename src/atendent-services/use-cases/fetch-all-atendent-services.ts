import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';

export class FetchAllAtendentServices {
  constructor(
    private atendentServicesRepository: IAtendentServicesRepository,
  ) {}

  async execute() {
    return await this.atendentServicesRepository.findAll();
  }
}
