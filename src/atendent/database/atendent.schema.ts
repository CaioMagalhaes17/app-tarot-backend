import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Atendent extends Document {
  @Prop({ required: true })
  services: {
    id: string;
    price: string;
    isActive: boolean;
  }[];

  @Prop({ required: true })
  specialities: string[];

  @Prop({ required: true })
  userId: string;
}

export const AtendentSchema = SchemaFactory.createForClass(Atendent);
