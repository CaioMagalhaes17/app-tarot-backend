import { IPaymentOrderRepository } from '../database/payment-order.repository.interface';
import { PaymentOrderEntity } from '../payment-order.entity';

export class InMemoryPaymentOrderRepository implements IPaymentOrderRepository {
  async findOrdersByUserId(userId: string): Promise<PaymentOrderEntity[]> {
    throw new Error('Method not implemented.');
  }

  async findByExternalId(
    externalId: string,
  ): Promise<PaymentOrderEntity | null> {
    const topicIndex = this.paymentOrders.findIndex(
      (item) => item.externalId === externalId,
    );
    if (!this.paymentOrders[topicIndex]) return null;
    return this.paymentOrders[topicIndex];
  }

  async create(data: PaymentOrderEntity): Promise<{ id: string }> {
    this.paymentOrders.push(data);
    return { id: data.id.toString() };
  }
  async findAll(): Promise<PaymentOrderEntity[]> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<PaymentOrderEntity> {
    throw new Error('Method not implemented.');
  }
  async updateById(
    id: string,
    updateData: PaymentOrderEntity,
  ): Promise<PaymentOrderEntity> {
    const topicIndex = this.paymentOrders.findIndex(
      (item) => item.id.toString() === id,
    );
    if (this.paymentOrders[topicIndex]) {
      this.paymentOrders[topicIndex] = updateData;
    }
    return this.paymentOrders[topicIndex];
  }
  async deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async deleteAll(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async findByParam<ParamType>(
    param: Partial<ParamType>,
    paginateObj?: { page: number; limit: number },
  ): Promise<PaymentOrderEntity[]> {
    throw new Error('Method not implemented.');
  }
  async search(field: string, query: string): Promise<PaymentOrderEntity[]> {
    throw new Error('Method not implemented.');
  }
  async findAllPaginated<T>(page: number, limit: number, param?: T) {
    throw new Error('Method not implemented.');
  }
  paymentOrders: PaymentOrderEntity[] = [];
}
