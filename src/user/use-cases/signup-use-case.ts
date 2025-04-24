import { Either, left, right } from 'src/core/Either';
import { UserRepository } from '../database/user.repository';
import { EncrypterGateway } from 'src/infra/auth/cryptography/encrypter.interface';
import { UserEntity } from '../user.entity';
import { LoginAlreadyExists } from '../errors/LoginAlreadyExists';

type UserSignupUseCaseResponse = Either<
  LoginAlreadyExists,
  { token: string; user: UserEntity }
>;
export class UserSignupUseCase {
  constructor(
    private userRepository: UserRepository,
    private encrypterGateway: EncrypterGateway,
  ) {}

  async execute({
    login,
    password,
    name,
    isAtendent,
    permission,
  }: {
    login: string;
    password: string;
    isAtendent: boolean;
    name: string;
    permission: string;
  }): Promise<UserSignupUseCaseResponse> {
    const user = await this.userRepository.findByParam<{ login: string }>({
      login,
    });
    if (user.length > 0) return left(new LoginAlreadyExists());
    const passwordHash = await this.encrypterGateway.encryptPassword(password);

    const idNewUser = await this.userRepository.create({
      login,
      password: passwordHash,
      isAtendent: isAtendent,
      permission: permission,
      name: name,
    });

    const newUser = await this.userRepository.findById(idNewUser.id);
    //procurar perfil da atendente, caso tenha retornar no token
    return right({
      token: this.encrypterGateway.encryptToken({
        id: newUser.id,
        name: newUser.name,
        isAtendent: newUser.isAtendent,
        permission: newUser.permission,
      }),
      user: newUser,
    });
  }
}
