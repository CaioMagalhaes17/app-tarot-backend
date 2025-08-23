import { Either, left, right } from 'src/core/Either';
import { InvalidLoginError } from '../errors/InvalidLogin';
import { EncrypterGateway } from 'src/infra/auth/cryptography/encrypter.interface';
import { UserEntity } from '../user.entity';
import { IUserRepository } from '../database/user.repository.interface';

type UserLoginUseCaseResponse = Either<
  InvalidLoginError,
  { token: string; user: UserEntity }
>;
export class UserLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private encrypterGateway: EncrypterGateway,
  ) {}

  async execute({
    login,
    password,
  }: {
    login: string;
    password: string;
  }): Promise<UserLoginUseCaseResponse> {
    const user = await this.userRepository.findByParam<{ login: string }>({
      login,
    });
    if (user.length === 0) return left(new InvalidLoginError());
    const isPasswordValid: boolean =
      await this.encrypterGateway.comparePassword(password, user[0].password);
    if (!isPasswordValid) return left(new InvalidLoginError());

    //procurar perfil da atendente, caso tenha retornar no token
    return right({
      token: this.encrypterGateway.encryptToken({
        id: user[0].id.toValue(),
        name: user[0].name,
        isAtendent: user[0].isAtendent,
        permission: user[0].permission,
      }),
      user: user[0],
    });
  }
}
