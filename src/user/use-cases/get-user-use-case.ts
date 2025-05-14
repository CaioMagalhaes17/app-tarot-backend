import { Either, left, right } from 'src/core/Either';
import { IUserRepository } from '../database/user.repository.interface';
import { UserNotFound } from '../errors/UserNotFound';
import { UserEntity } from '../user.entity';

type GetUserUseCaseResponse = Either<UserNotFound, UserEntity>;

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<GetUserUseCaseResponse> {
    const result = await this.userRepository.findById(id);
    if (!result) return left(new UserNotFound());
    return right(result);
  }
}
