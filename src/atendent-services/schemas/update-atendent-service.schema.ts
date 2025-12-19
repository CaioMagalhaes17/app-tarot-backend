import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateAtendentServiceDTO {
  @IsString({ message: 'description must be a valid string' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'price must be a valid number' })
  @Min(0, { message: 'price must be greater than or equal to 0' })
  @IsOptional()
  price?: number;

  @IsBoolean({ message: 'isActive must be a valid boolean' })
  @IsOptional()
  isActive?: boolean;
}

