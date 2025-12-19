import { Either, left, right } from 'src/core/Either';
import { IUserRepository } from '../database/user.repository.interface';
import { UserNotFound } from '../errors/UserNotFound';
import { UserEntity } from '../user.entity';
import { IAtendentRepository } from 'src/atendent/database/atendent.repository.interface';
import { AtendentEntity } from 'src/atendent/atendent.entity';

type GetUserUseCaseResponse = Either<
  UserNotFound,
  { user: UserEntity; atendent?: AtendentEntity }
>;

export class GetUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly atendentRepository: IAtendentRepository,
  ) {}

  async execute(id: string): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) return left(new UserNotFound());

    let atendent: AtendentEntity | null = null;
    if (user.isAtendent) {
      atendent = await this.atendentRepository.findByUserId(id);
    }

    return right({ user, atendent: atendent || undefined });
  }
}
