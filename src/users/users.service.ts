import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  async findAll() {
    return this.prisma.user.findMany({ include: { tasks: false } });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Check if the password is being updated
    if (updateUserDto.password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      // Update the user with the hashed password
      return this.prisma.user.update({
        where: { id },
        data: { ...updateUserDto, password: hashedPassword },
      });
    } else {
      // If the password is not being updated, update the user with the provided data
      return this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
    }
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
