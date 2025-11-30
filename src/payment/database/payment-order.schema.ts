import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OrderStatus, OrderType } from '../payment-order.entity';
import { ProductCategory } from 'src/products/product-entity';

@Schema({ timestamps: true })
export class PaymentOrder extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, enum: ['payment', 'withdrawal'], required: true })
  type: OrderType;

  @Prop({ type: String, enum: ['minutes'], required: true })
  productType: ProductCategory;

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
