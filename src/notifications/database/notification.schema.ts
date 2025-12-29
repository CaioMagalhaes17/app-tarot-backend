import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationType } from '../notification.entity';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({
    type: String,
    enum: ['payment_approved', 'appointment_created', 'appointment_cancelled', 'general'],
    required: true,
  })
  type: NotificationType;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

