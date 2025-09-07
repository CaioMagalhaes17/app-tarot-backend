import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/database/user.schema';
import { MinutesTransaction } from '../client-minutes.entity';
import { PaymentOrder } from 'src/payment/database/payment-order.schema';

@Schema({ timestamps: true })
export class ClientMinutes extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalMinutes: number; // Total acumulado comprado

  @Prop({ type: Number, default: 0 })
  avaliableMinutes: number; // Minutos ainda disponíveis para uso

  @Prop({
    type: [
      {
        type: {
          type: String,
          enum: ['purchase', 'usage', 'refund', 'bonus'],
          required: true,
        },
        minutes: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        description: { type: String },
        status: {
          type: String,
          enum: ['pending', 'completed', 'failed'],
          required: true,
        },
        paymentOrder: {
          type: Types.ObjectId,
          ref: PaymentOrder.name,
          required: true,
        },
      },
    ],
    default: [],
  })
  transactions: MinutesTransaction[];

  @Prop()
  createdAt: Date;
}

export const ClientMinutesSchema = SchemaFactory.createForClass(ClientMinutes);
