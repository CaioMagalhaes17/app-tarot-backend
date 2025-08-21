import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/database/user.schema';
import { OrderStatus, OrderType } from '../payment-order.entity';

@Schema({ timestamps: true })
export class PaymentOrder extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['payment', 'withdrawal'], required: true })
  type: OrderType;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
  })
  status: OrderStatus;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  description?: string;

  @Prop()
  errorDescription?: string;

  @Prop()
  externalId?: string;

  @Prop()
  paymentMethod?: string;

  @Prop()
  withdrawlMethod?: string;
}

export const PaymentOrderSchema = SchemaFactory.createForClass(PaymentOrder);
