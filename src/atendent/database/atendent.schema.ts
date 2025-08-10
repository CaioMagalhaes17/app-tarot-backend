import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/database/user.schema';

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

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const AtendentSchema = SchemaFactory.createForClass(Atendent);
