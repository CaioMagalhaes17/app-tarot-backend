import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentPaymentDTO {
  @IsString()
  @IsNotEmpty({ message: 'atendentServiceId é obrigatório' })
  atendentServiceId: string;

  @IsDateString({}, { message: 'date deve ser uma data válida no formato ISO' })
  @IsNotEmpty({ message: 'date é obrigatória' })
  date: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'startTime deve estar no formato HH:MM',
  })
  @IsNotEmpty({ message: 'startTime é obrigatório' })
  startTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'endTime deve estar no formato HH:MM',
  })
  @IsNotEmpty({ message: 'endTime é obrigatório' })
  endTime: string;
}

