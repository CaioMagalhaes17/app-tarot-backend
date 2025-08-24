import { Either, left, right } from 'src/core/Either';
import { IClientMinutesRepository } from '../database/client-minutes.repository.interface';
import { UserNotFound } from 'src/user/errors/UserNotFound';
import { IPaymentOrderRepository } from 'src/payment/database/payment-order.repository.interface';
import { PaymentOrderNotFound } from 'src/payment/error/PaymentOrderNotFound';
import { MinutesNotFound } from '../errors/minutes-not-found';
import { TransactionNotFound } from '../errors/transaction-not-found';
import { IUserRepository } from 'src/user/database/user.repository.interface';

type UpdateMinutesTransactionUseCaseResponse = Either<
  UserNotFound | PaymentOrderNotFound | MinutesNotFound | TransactionNotFound,
  null
>;
export class UpdateMinutesTransactionUseCase {
  constructor(
    private clientMinutesRepository: IClientMinutesRepository,
    private paymentOrderRepository: IPaymentOrderRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    paymentOrderId: string,
  ): Promise<UpdateMinutesTransactionUseCaseResponse> {
    const user = await this.userRepository.findById(userId);
    if (!user) return left(new UserNotFound());
    const paymentOrder =
      await this.paymentOrderRepository.findById(paymentOrderId);
    if (!paymentOrder) return left(new PaymentOrderNotFound());
    const clientMinutes = await this.clientMinutesRepository.findByParam<{
      userId: string;
    }>({ userId });
    if (clientMinutes.length === 0) return left(new MinutesNotFound());
    const transactionIndex = clientMinutes[0].transactions.findIndex(
      (item) => item.paymentOrder.id.toString() === paymentOrderId,
    );
    if (transactionIndex === -1) return left(new TransactionNotFound());
    clientMinutes[0].addMinutesPurchased(transactionIndex);
    await this.clientMinutesRepository.updateById(
      clientMinutes[0].id.toString(),
      clientMinutes[0],
    );
    return right(null);
  }
}
