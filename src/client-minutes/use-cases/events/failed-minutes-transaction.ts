import { Either, left, right } from 'src/core/Either';
import { IClientMinutesRepository } from '../../database/client-minutes.repository.interface';
import { MinutesNotFound } from '../../errors/minutes-not-found';
import { TransactionNotFound } from '../../errors/transaction-not-found';
import { PaymentOrderEntity } from 'src/payment/payment-order.entity';

type FailedMinutesTransactionUseCaseResponse = Either<
  MinutesNotFound | TransactionNotFound,
  null
>;
export class FailedMinutesTransactionUseCase {
  constructor(private clientMinutesRepository: IClientMinutesRepository) {}

  async execute(
    paymentOrder: PaymentOrderEntity,
  ): Promise<FailedMinutesTransactionUseCaseResponse> {
    const clientMinutes = await this.clientMinutesRepository.findByUserId(
      paymentOrder.userId,
    );
    if (!clientMinutes) return left(new MinutesNotFound());
    const transactionIndex = clientMinutes.transactions.findIndex(
      (item) => item.paymentOrder.id.toString() === paymentOrder.id.toString(),
    );
    if (transactionIndex === -1) return left(new TransactionNotFound());
    clientMinutes.failedTransaction(
      transactionIndex,
      `Erro na compra de minutos - ${paymentOrder.errorDescription}`,
    );

    await this.clientMinutesRepository.updateById(
      clientMinutes.id.toString(),
      clientMinutes,
    );
    return right(null);
  }
}
