import { UserEntity, UserProps } from '../user.entity';

export function makeUser(override?: Partial<UserProps>, id?: string) {
  const data = {
    isAtendent: false,
    isVerified: true,
    login: 'teste',
    name: 'teste',
    password: '123',
    permission: 'normal',
    profileImg: 'teste',
    ...override,
  };

  return UserEntity.create(data, id || 'USER_ID');
}
