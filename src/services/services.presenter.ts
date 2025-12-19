import { ServicesEntity } from './services.entity';

export class ServicesPresenter {
  static toHttp(service: ServicesEntity) {
    return {
      id: service.id.toString(),
      name: service.name,
      description: service.description,
      serviceImg: service.serviceImg,
    };
  }

  static toHttpArray(services: ServicesEntity[]) {
    return services.map((service) => ServicesPresenter.toHttp(service));
  }
}
