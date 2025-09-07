import { BaseMapperInterface } from 'src/core/base.mapper.interface';
import { ClientMinutes } from './client-minutes.schema';
import { ClientMinutesEntity } from '../client-minutes.entity';
import { UserEntity } from 'src/user/user.entity';
import { FlattenMaps, Types } from 'mongoose';
import { PaymentOrderMapper } from 'src/payment/database/payment-order.mapper';

export class ClientMinutesMapper
  implements BaseMapperInterface<ClientMinutes, ClientMinutesEntity> {
  toDomain(row: any): ClientMinutesEntity {
    if (!row) return;
    const { _id, ...rest } = row;
    const userRow = row.userId as any;
    const transactions =
      row.transactions.length > 0
        ? row.transactions.map((transaction) => {
          return {
            ...transaction,
            paymentOrder: new PaymentOrderMapper().toDomain(
              transaction.paymentOrder,
            ),
          };
        })
        : [];
    return ClientMinutesEntity.create(
      {
        ...rest,
        transactions,
        user: this.formatUser(userRow),
      },
      _id.toString() as string,
    );
  }

  toDomainArray(rows: FlattenMaps<ClientMinutes>[]): ClientMinutesEntity[] {
    if (!rows || rows.length === 0) return [];
    return rows
      .map((row) => this.toDomain(row))
      .filter((item) => item !== null);
  }

  toPersistance(domain: ClientMinutesEntity) {
    return {
      userId: new Types.ObjectId(domain.user.id.toString()),
      avaliableMinutes: domain.avaliableMinutes,
      totalMinutes: domain.totalMinutes,
      transactions: domain.transactions.map((transaction) => {
        return {
          ...transaction,
          paymentOrder: {
            _id: transaction.paymentOrder.id.toValue(),
            ...new PaymentOrderMapper().toPersistance(transaction.paymentOrder),
          },
        };
      }),
    };
  }

  formatUser(userRow: any) {
    const user = UserEntity.create(
      {
        isAtendent: userRow.isAtendent,
        isVerified: userRow.isVerified,
        login: userRow.login,
        name: userRow.name,
        password: userRow.password,
        permission: userRow.permission,
        profileImg: userRow.profileImg,
        createdAt: userRow.createdAt,
        updatedAt: userRow.updatedAt,
      },
      userRow._id.toString(),
    );
    return user;
  }
}
