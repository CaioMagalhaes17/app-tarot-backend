import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { AppointmentStatusEnum } from '../appointment.entity';

export class UpdateAppointmentDTO {
  @Type(() => Date)
  @IsDate({ message: 'date must be a valid Date' })
  @IsOptional()
  date?: Date;

  @IsEnum(AppointmentStatusEnum, {
    message: 'status must be one of: scheduled, on-going, completed, canceled',
  })
  @IsOptional()
  status: AppointmentStatusEnum;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:MM format',
  })
  @IsOptional()
  startTime?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime must be in HH:MM format',
  })
  @IsOptional()
  endTime?: string;
}
