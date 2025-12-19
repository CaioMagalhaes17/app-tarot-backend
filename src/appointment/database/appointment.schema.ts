import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AtendentServices } from 'src/atendent-services/database/atendent-services.schema';
import { User } from 'src/user/database/user.schema';
import { AppointmentStatus } from '../appointment.entity';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: AtendentServices.name,
    required: true,
  })
  atendentServiceId: AtendentServices;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: User;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/,
  })
  startTime: string;

  @Prop({
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/,
  })
  endTime: string;

  @Prop({
    type: String,
    enum: ['scheduled', 'on-going', 'completed', 'canceled'],
    default: 'scheduled',
    required: true,
  })
  status: AppointmentStatus;

  @Prop({ type: String, required: false })
  canceledReason?: string;

  @Prop({ type: Types.ObjectId, required: false })
  paymentOrderId?: Types.ObjectId;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
