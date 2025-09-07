/* eslint-disable prefer-const */
import { IUserRepository } from 'src/user/database/user.repository.interface';
import { IClientMinutesRepository } from '../database/client-minutes.repository.interface';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { Either, left, right } from 'src/core/Either';
import { ClientMinutesEntity } from '../client-minutes.entity';
import { IPaymentOrderRepository } from 'src/payment/database/payment-order.repository.interface';
import { PaymentOrderNotFound } from 'src/payment/error/PaymentOrderNotFound';

export class CreateMinutesTransaction {
  constructor(
    private clientMinutesRepository: IClientMinutesRepository,
    private userRepository: IUserRepository,
    private paymentOrderRepository: IPaymentOrderRepository,
  ) {}

  async execute(
    userId: string,
    minutes: number,
    paymentOrderId: string,
  ): Promise<Either<UserNotFound | PaymentOrderNotFound, null>> {
    const user = await this.userRepository.findById(userId);
    if (!user) return left(new UserNotFound());
    const paymentOrder =
      await this.paymentOrderRepository.findById(paymentOrderId);
    if (!paymentOrder) return left(new PaymentOrderNotFound());
    let clientMinutes: ClientMinutesEntity =
      await this.clientMinutesRepository.findByUserId(userId);
    if (!clientMinutes) {
      const minutesRow = ClientMinutesEntity.create({
        avaliableMinutes: 0,
        totalMinutes: 0,
        transactions: [],
        createdAt: new Date(),
        user,
      });
      await this.clientMinutesRepository.create(minutesRow);
      clientMinutes = await this.clientMinutesRepository.findByUserId(userId);
    }
    clientMinutes.createTransaction({
      date: new Date(),
      minutes,
      type: 'purchase',
      description: 'Compra aguardando pagamento',
      status: 'pending',
      paymentOrder,
    });
    await this.clientMinutesRepository.updateById(
      clientMinutes.id.toString(),
      clientMinutes,
    );

    return right(null);
  }
}
