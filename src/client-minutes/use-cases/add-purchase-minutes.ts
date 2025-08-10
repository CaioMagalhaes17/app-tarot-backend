/* eslint-disable prefer-const */
import { Either, left, right } from 'src/core/Either';
import { ClientMinutesEntity } from '../client-minutes.entity';
import { IClientMinutesRepository } from '../database/client-minutes.repository.interface';
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { UserNotFound } from 'src/user/errors/UserNotFound';

export class AddPurchaseMinutesUseCase {
  constructor(
    private clientMinutesRepository: IClientMinutesRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    minutes: number,
  ): Promise<Either<UserNotFound, null>> {
    const user = await this.userRepository.findById(userId);
    if (!user) return left(new UserNotFound());
    let clientMinutes = await this.clientMinutesRepository.findByParam<{
      userId: string;
    }>({ userId });
    if (clientMinutes.length === 0) {
      const newMinutes = ClientMinutesEntity.create({
        avaliableMinutes: 0,
        totalMinutes: 0,
        transactions: [],
        user,
      });
      await this.clientMinutesRepository.create(newMinutes);
      clientMinutes = await this.clientMinutesRepository.findByParam<{
        userId: string;
      }>({ userId });
    }
    clientMinutes[0].addTransaction({
      date: new Date(),
      minutes,
      type: 'purchase',
      description: 'Compra efetuada',
    });

    await this.clientMinutesRepository.updateById(
      clientMinutes[0].id.toString(),
      clientMinutes[0],
    );

    return right(null);
  }
}
