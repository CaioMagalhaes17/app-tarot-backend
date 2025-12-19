import { UserEntity } from './user.entity';

export class UserPresenter {
  static toHttp(user: UserEntity, isToShowSensitive?: boolean) {
    if (isToShowSensitive) {
      return {
        id: user.id.toString(),
        login: user.login,
        name: user.name,
        isAtendent: user.isAtendent,
        permission: user.permission,
        isVerified: user.isVerified,
        profileImg: user.profileImg,
        createdAt: user.createdAt,
      };
    }
    return {
      id: user.id.toString(),
      name: user.name,
      isAtendent: user.isAtendent,
      profileImg: user.profileImg,
      createdAt: user.createdAt,
    };
  }
}
