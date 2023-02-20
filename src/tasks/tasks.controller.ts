import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';

@Controller('api/v1/tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async insert(@Body() createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      return await this.tasksService.insert(createTaskDto);
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async find(@Query() filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    try {
      return await this.tasksService.find(filterDto);
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TaskEntity> {
    try {
      return await this.tasksService.findOne(id);
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    try {
      return await this.tasksService.update(id, updateTaskDto);
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.detail,
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<TaskEntity> {
    try {
      return await this.tasksService.updateStatus(id, status);
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.tasksService.delete(id);
      return;
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
