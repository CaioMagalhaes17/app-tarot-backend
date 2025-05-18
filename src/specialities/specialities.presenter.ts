import { SpecialitiesEntity } from './specialities.entity';

export class SpecialitiesPresenter {
  static toHttp(service: SpecialitiesEntity) {
    return {
      id: service.id,
      name: service.name,
      topicid: service.topicId,
    };
  }
}
