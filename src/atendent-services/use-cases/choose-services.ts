import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';
import { IServicesRepository } from 'src/services/database/services.repository.interface';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { AtendentServicesEntity } from '../atendent-services.entity';

type ChooseServicesUseCaseRequest = {
  services: {
    id: string;
    customDescription: string;
    price: number;
  }[];
  atendentId: string;
};
export class ChooseServicesUseCase {
  constructor(
    private atendentServicesRepository: IAtendentServicesRepository,
    private servicesRepository: IServicesRepository,
    private atendentRepository: IAtendentRepository,
  ) {}

  async execute({ atendentId, services }: ChooseServicesUseCaseRequest) {
    const atendent = await this.atendentRepository.findById(atendentId);
    for (const service of services) {
      const serviceEntity = await this.servicesRepository.findById(service.id);
      const atendentService = AtendentServicesEntity.create({
        atendent,
        description: service.customDescription,
        price: service.price,
        service: serviceEntity,
      });
      await this.atendentServicesRepository.create(atendentService);
    }
  }
}
