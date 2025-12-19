import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductCategory } from '../payment-order.entity';

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  productType: ProductCategory;
}
