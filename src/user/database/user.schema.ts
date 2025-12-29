import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  password: string;

  @Prop({ required: true })
  isAtendent: boolean;

  @Prop()
  permission: string;

  @Prop()
  isVerified: boolean;

  @Prop()
  profileImg: string;

  @Prop({ required: false, unique: true })
  googleId: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
