import { IAtendentServicesRepository } from '../database/atendent-services.repository.interface';

export class ExcludeServiceUseCase {
  constructor(
    private atendentServicesRepository: IAtendentServicesRepository,
  ) {}

  async execute(atendentServiceId: string) {
    const atendentService =
      await this.atendentServicesRepository.findById(atendentServiceId);
    atendentService.inactivate();
    await this.atendentServicesRepository.updateById(
      atendentServiceId,
      atendentService,
    );
  }
}
