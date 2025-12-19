import { UserPresenter } from 'src/user/user.presenter';
import { AtendentEntity } from './atendent.entity';

export class AtendentPresenter {
  static toHttp(atendent: AtendentEntity) {
    return {
      id: atendent.id.toString(),
      user: UserPresenter.toHttp(atendent.user),
      name: atendent.name,
      bio: atendent.bio,
      rating: atendent.rating,
      schedule: atendent.schedule,
    };
  }
}
