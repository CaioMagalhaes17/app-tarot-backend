import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';
import { IServicesRepository } from 'src/services/database/services.repository.interface';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { AtendentServicesEntity } from '../atendent-services.entity';
import { Either, left, right } from 'src/core/Either';
import { AtendentAlreadyChoosedServiceError } from '../errors/atendend-already-choose-service';

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

  async execute({
    atendentId,
    services,
  }: ChooseServicesUseCaseRequest): Promise<
    Either<AtendentAlreadyChoosedServiceError, null>
  > {
    const atendent = await this.atendentRepository.findById(atendentId);
    for (const service of services) {
      const alreadyExists =
        await this.atendentServicesRepository.findAtendentServiceByServiceId(
          service.id,
        );
      if (alreadyExists) return left(new AtendentAlreadyChoosedServiceError());
      const serviceEntity = await this.servicesRepository.findById(service.id);
      const atendentService = AtendentServicesEntity.create({
        atendent,
        description: service.customDescription,
        price: service.price,
        service: serviceEntity,
      });
      await this.atendentServicesRepository.create(atendentService);
    }
    return right(null);
  }
}
