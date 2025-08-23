import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentOrder, PaymentOrderSchema } from './payment-order.schema';
import { PaymentOrderMapper } from './payment-order.mapper';
import { PaymentOrderRepository } from './payment-order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentOrder.name, schema: PaymentOrderSchema },
    ]),
  ],
  providers: [
    PaymentOrderMapper,
    {
      provide: PaymentOrderRepository,
      useFactory: (model: Model<PaymentOrder>, mapper: PaymentOrderMapper) => {
        return new PaymentOrderRepository(model, mapper);
      },
      inject: [getModelToken(PaymentOrder.name), PaymentOrderMapper],
    },
  ],
  exports: [PaymentOrderRepository],
})
export class PaymentOrderDatabaseModule {}
