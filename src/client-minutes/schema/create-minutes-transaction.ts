import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMinutesTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  minutes: number;

  @IsString()
  @IsNotEmpty()
  paymentOrderId: string;
}
