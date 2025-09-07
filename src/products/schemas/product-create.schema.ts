import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ProductCategory } from '../product-entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  category: ProductCategory;
}
