import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @MinLength(1)
  amount: number;
}
