import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTaskDto, userId: string) {
    // console.log('createTaskDto', createTaskDto);
    // console.log('userId', userId);
    return this.prisma.task.create({ data: { ...createTaskDto, userId } });
  }

  async getTasks(userId: string) {
    // console.log('userId', userId);
    console.log('TasksService getTasks userId:', userId);
    return this.prisma.task.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async getTaskById(id: string, userId: string) {
    return this.prisma.task.findFirst({ where: { id, userId } });
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    return this.prisma.task.update({
      where: { id, userId },
      data: updateTaskDto,
    });
  }

  async deleteTask(id: string, userId: string) {
    return this.prisma.task.delete({ where: { id, userId } });
  }
}
