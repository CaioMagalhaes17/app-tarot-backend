import { UserEntity } from './user.entity';

export class UserPresenter {
  static toHttp(user: UserEntity) {
    return {
      id: user.id,
      login: user.login,
      name: user.name,
      isAtendent: user.isAtendent,
      permission: user.permission,
      isVerified: user.isVerified,
      profileImg: user.profileImg,
      createdAt: user.createdAt,
    };
  }
}
