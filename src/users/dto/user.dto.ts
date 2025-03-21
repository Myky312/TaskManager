import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator'; // Import necessary decorators

export class UserDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}
