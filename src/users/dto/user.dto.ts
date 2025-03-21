import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../entities/user.entity';

export class UserDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Role }) // Add role to the DTO
  @IsEnum(Role)
  role: Role;
}
