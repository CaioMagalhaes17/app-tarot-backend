import { ServicesEntity } from './services.entity';

export class ServicesPresenter {
  static toHttp(service: ServicesEntity) {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      serviceImg: service.serviceImg,
    };
  }
}
