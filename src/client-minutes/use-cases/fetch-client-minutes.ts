import { IUserRepository } from 'src/user/database/user.repository.interface';
import { IClientMinutesRepository } from '../database/client-minutes.repository.interface';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { Either, left, right } from 'src/core/Either';
import { ClientMinutesEntity } from '../client-minutes.entity';

export class FetchClientMinutes {
  constructor(
    private clientMinutesRepository: IClientMinutesRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(
    userId: string,
  ): Promise<Either<UserNotFound, ClientMinutesEntity>> {
    const user = await this.userRepository.findById(userId);
    if (!user) return left(new UserNotFound());
    const clientMinutes =
      await this.clientMinutesRepository.findByUserId(userId);
    if (!clientMinutes) {
      const newMinutes = ClientMinutesEntity.create({
        avaliableMinutes: 0,
        totalMinutes: 0,
        transactions: [],
        createdAt: new Date(),
        user,
      });
      await this.clientMinutesRepository.create(newMinutes);
      return right(newMinutes);
    }
    return right(clientMinutes);
  }
}
