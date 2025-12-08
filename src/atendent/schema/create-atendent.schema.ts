import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ScheduleDto } from './schedule.schema';
import { Type } from 'class-transformer';

export class CreateAtendentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;
}
