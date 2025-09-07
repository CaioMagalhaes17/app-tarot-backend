import { Either, left, right } from 'src/core/Either';
import { IClientMinutesRepository } from '../../database/client-minutes.repository.interface';
import { MinutesNotFound } from '../../errors/minutes-not-found';
import { TransactionNotFound } from '../../errors/transaction-not-found';
import { PaymentOrderEntity } from 'src/payment/payment-order.entity';

type AddMinutesTransactionUseCaseResponse = Either<
  MinutesNotFound | TransactionNotFound,
  null
>;
export class AddMinutesTransactionUseCase {
  constructor(private clientMinutesRepository: IClientMinutesRepository) {}

  async execute(
    paymentOrder: PaymentOrderEntity,
  ): Promise<AddMinutesTransactionUseCaseResponse> {
    const clientMinutes = await this.clientMinutesRepository.findByUserId(
      paymentOrder.userId,
    );
    if (!clientMinutes) return left(new MinutesNotFound());
    const transactionIndex = clientMinutes.transactions.findIndex(
      (item) => item.paymentOrder.id.toString() === paymentOrder.id.toString(),
    );
    if (transactionIndex === -1) return left(new TransactionNotFound());
    clientMinutes.addMinutesPurchased(transactionIndex);
    await this.clientMinutesRepository.updateById(
      clientMinutes.id.toString(),
      clientMinutes,
    );
    return right(null);
  }
}
