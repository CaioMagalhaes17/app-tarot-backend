import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Specialities extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  topicId: string;
}

export const SpecialitiesSchema = SchemaFactory.createForClass(Specialities);
