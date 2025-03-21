import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
