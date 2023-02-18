import { Inject, Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskRepository: Repository<Task>,
  ) {}

  async insert(createTaskDto: CreateTaskDto): Promise<Task> {
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

  async findAll(): Promise<Task[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const tasks = await this.taskRepository.find();

        resolve(tasks);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

  async filteredFind(filterDto: any): Promise<Task[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { status, search } = filterDto;

        let tasks = await this.taskRepository.find();

        if (status) {
          tasks = tasks.filter(
            (task) => task.status.toLowerCase() === status.toLowerCase(),
          );
        }

        if (search) {
          tasks = tasks.filter(
            (task) =>
              task.title.toLowerCase().includes(search.toLowerCase())
              || task.description.toLowerCase().includes(search.toLowerCase()),
          );
        }

        resolve(tasks);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

  async findOne(id: string): Promise<Task> {
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

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
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

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
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
