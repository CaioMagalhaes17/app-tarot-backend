import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Atendent } from 'src/atendent/database/atendent.schema';
import { Services } from 'src/services/database/services.schema';

@Schema({ timestamps: true })
export class AtendentServices extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: Atendent.name, required: true })
  atendentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Services.name, required: true })
  serviceId: Types.ObjectId;
}

export const AtendentServicesSchema =
  SchemaFactory.createForClass(AtendentServices);
