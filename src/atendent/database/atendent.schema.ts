import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from 'src/user/database/user.schema';
import { Schedule } from '../atendent.entity';

@Schema({ timestamps: true })
export class Atendent extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  bio: string;

  @Prop({ type: Number, required: true })
  rating: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  schedule: Schedule;
}

export const AtendentSchema = SchemaFactory.createForClass(Atendent);
