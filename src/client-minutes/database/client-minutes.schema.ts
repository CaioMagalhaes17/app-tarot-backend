import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/database/user.schema';

@Schema({ timestamps: true })
export class ClientMinutes extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalMinutes: number; // Total acumulado comprado

  @Prop({ type: Number, default: 0 })
  avaliableMinutes: number; // Minutos ainda disponíveis para uso

  @Prop({
    type: [
      {
        type: {
          type: String,
          enum: ['purchase', 'usage', 'refund', 'bonus'],
          required: true,
        },
        minutes: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        description: { type: String },
      },
    ],
    default: [],
  })
  transactions: {
    type: string; // purchase, usage, refund, bonus
    minutes: number;
    date: Date;
    description?: string;
  }[];
}

export const ClientMinutesSchema = SchemaFactory.createForClass(ClientMinutes);
