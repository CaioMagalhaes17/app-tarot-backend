import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductType } from '../payment-order.entity';

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  productType: ProductType;
}
