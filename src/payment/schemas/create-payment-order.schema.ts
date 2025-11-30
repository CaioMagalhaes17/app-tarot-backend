import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductCategory } from 'src/products/product-entity';

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
