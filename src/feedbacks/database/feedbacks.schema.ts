import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Feedbacks extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  atendentId: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rating: number;
}

export const FeedbacksSchema = SchemaFactory.createForClass(Feedbacks);
