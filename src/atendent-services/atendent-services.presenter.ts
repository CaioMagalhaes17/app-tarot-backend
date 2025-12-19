import { AtendentServicesEntity } from './atendent-services.entity';
import { AtendentPresenter } from 'src/atendent/atendent.presenter';
import { ServicesPresenter } from 'src/services/services.presenter';

export class AtendentServicesPresenter {
  static toHttp(atendentService: AtendentServicesEntity) {
    return {
      id: atendentService.id.toString(),
      description: atendentService.description,
      price: atendentService.price,
      isActive: atendentService.isActive,
      service: ServicesPresenter.toHttp(atendentService.service),
      atendent: AtendentPresenter.toHttp(atendentService.atendent),
      createdAt: atendentService.createdAt,
      updatedAt: atendentService.updatedAt,
    };
  }

  static toHttpArray(atendentServices: AtendentServicesEntity[]) {
    return atendentServices.map((atendentService) =>
      this.toHttp(atendentService),
    );
  }
}

