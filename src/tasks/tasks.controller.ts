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
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'; // Import Swagger decorators

@ApiTags('tasks') // Add tags for grouping in Swagger UI
@Controller('tasks')
@ApiBearerAuth() // Require bearer token for all endpoints in this controller
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The task has been successfully created.',
    type: CreateTaskDto,
  })
  create(@Body() createTaskDto: CreateTaskDto, @User('id') userId: string) {
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'List of tasks.', type: [CreateTaskDto] })
  findAll(@User('id') userId: string) {
    return this.tasksService.getTasks(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Task details.', type: CreateTaskDto })
  findOne(@Param('id') id: string, @User('id') userId: string) {
    return this.tasksService.getTaskById(id, userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Task updated successfully.',
    type: CreateTaskDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @User('id') userId: string,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Task deleted successfully.' })
  remove(@Param('id') id: string, @User('id') userId: string) {
    return this.tasksService.deleteTask(id, userId);
  }
}
