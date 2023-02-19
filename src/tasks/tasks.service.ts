import { Inject, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';

import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async insert(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.taskRepository.insert({
          ...createTaskDto,
          status: TaskStatus.OPEN,
        });

        const { id } = response.generatedMaps[0];

        const created: TaskEntity = new TaskEntity();

        created.id = id;
        created.title = createTaskDto.title;
        created.description = createTaskDto.description;
        created.status = TaskStatus.OPEN;

        await this.taskRepository.save(created);

        resolve(created);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

  async find(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { status, search } = filterDto;

        const query = this.taskRepository.createQueryBuilder('task');

        if (status) query.andWhere('task.status = :status', { status });

        if (search)
          query.andWhere(
            '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
            { search: `%${search}%` },
          );

        const tasks = await query.getMany();

        resolve(tasks);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

  async findOne(id: string): Promise<TaskEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const found = await this.taskRepository.findOne({
          where: {
            id,
          },
        });

        if (!found) {
          reject({
            code: '404',
            detail: 'Task not found',
          });
        }

        resolve(found);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.taskRepository.preload({
          id,
          ...updateTaskDto,
        });

        if (!response) {
          reject({
            code: '404',
            detail: 'Task not found',
          });
        }

        await this.taskRepository.save(response);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

  async updateStatus(id: string, status: TaskStatus): Promise<TaskEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const found = await this.findOne(id);
        if (!found) {
          reject({
            code: '404',
            detail: 'Task not found',
          });
        }
        found.status = status;
        await this.taskRepository.save(found);
        resolve(found);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.taskRepository.delete(id);
        const { affected } = response;
        if (affected === 0) {
          reject({
            code: 404,
            detail: 'Course not found',
          });
        }
        resolve(true);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }
}
