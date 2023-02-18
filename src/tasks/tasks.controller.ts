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
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async insert(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
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
  async find(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    try {
      if (Object.keys(filterDto).length) {
        return await this.tasksService.filteredFind(filterDto);
      }

      return await this.tasksService.findAll();
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
  async findOne(@Param('id') id: string): Promise<Task> {
    try {
      return await this.tasksService.findOne(id);
    } catch (err) {
      console.log(err);
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
  ): Promise<Task> {
    try {
      return await this.tasksService.update(id, updateTaskDto);
    } catch (err) {
      console.log(err);
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
  ): Promise<Task> {
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
