import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tast.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createTaskDto: CreateTaskDto, @User('id') userId: string) {
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User('id') userId: string) {
    return this.tasksService.getTasks(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.tasksService.getTaskById(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User('id') userId: string,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId: string) {
    return this.tasksService.deleteTask(id, userId);
  }
}
