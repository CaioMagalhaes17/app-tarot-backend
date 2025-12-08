import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ScheduleAppointmentDTO {
  @IsString({ message: 'atendentServiceId must be a valid string' })
  @IsNotEmpty()
  atendentServiceId: string;

  @Type(() => Date)
  @IsDate({ message: 'date must be a valid Date' })
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime: string;
}
