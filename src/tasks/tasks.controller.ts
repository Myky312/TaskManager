import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../common/decorators/user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'; // Import Swagger decorators
// import { TaskStatus } from './entities/task.entity';
// import { SortQueryDto } from './dto/sort-query.dto';

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
    // console.log('TasksController findAll userId:', userId);
    return this.tasksService.getTasks(userId);
  }

  @Get('filtered')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'Filtered list of tasks.',
    type: [CreateTaskDto],
  })
  async getFiltered(@Query() query: any, @User('id') userId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const filters = { status: query.status };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const sort = query['sort[field]']
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        { [query['sort[field]']]: query['sort[order]'] || 'asc' }
      : undefined;

    console.log('🚀 Final Filters:', filters);
    console.log('🚀 Final OrderBy:', sort);

    return this.tasksService.getFilteredTasks(userId, filters, sort);
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
