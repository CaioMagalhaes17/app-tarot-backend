import { IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

export class WorkRangeDto {
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'start must be in HH:MM format',
  })
  start: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'end must be in HH:MM format',
  })
  end: string;
}

export class ScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkRangeDto)
  monday: WorkRangeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkRangeDto)
  tuesday: WorkRangeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkRangeDto)
  wednesday: WorkRangeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkRangeDto)
  thursday: WorkRangeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkRangeDto)
  friday: WorkRangeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkRangeDto)
  saturday: WorkRangeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkRangeDto)
  sunday: WorkRangeDto[];
}
