import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: false })
  imageUrl?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
