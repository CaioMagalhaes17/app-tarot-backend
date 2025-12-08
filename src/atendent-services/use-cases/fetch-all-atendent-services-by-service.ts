import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';

export class FetchAllAtendentServicesByService {
  constructor(
    private atendentServicesRepository: IAtendentServicesRepository,
  ) {}

  async execute(serviceId: string) {
    return await this.atendentServicesRepository.findAtendentServiceByServiceId(
      serviceId,
    );
  }
}
