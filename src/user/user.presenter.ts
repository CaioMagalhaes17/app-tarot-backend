import { UserEntity } from './user.entity';
import { AtendentEntity } from 'src/atendent/atendent.entity';

export class UserPresenter {
  static toHttp(
    user: UserEntity,
    isToShowSensitive?: boolean,
    atendent?: AtendentEntity,
  ) {
    const baseResponse: any = {
      id: user.id.toString(),
      name: user.name,
      isAtendent: user.isAtendent,
      profileImg: user.profileImg,
      createdAt: user.createdAt,
    };

    if (isToShowSensitive) {
      baseResponse.login = user.login;
      baseResponse.permission = user.permission;
      baseResponse.isVerified = user.isVerified;
    }

    if (atendent) {
      baseResponse.atendent = {
        id: atendent.id.toString(),
        name: atendent.name,
        bio: atendent.bio,
        rating: atendent.rating,
        schedule: atendent.schedule,
      };
    }

    return baseResponse;
  }
}
