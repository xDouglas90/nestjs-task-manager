import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';

import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  async insert(createTaskDto: CreateTaskDto): Promise<Task> {
    return new Promise((resolve, reject) => {
      try {
        const { title, description } = createTaskDto;

        const newTask: Task = {
          id: uuidv4(),
          title,
          description,
          status: TaskStatus.OPEN,
        };

        this.tasks.push(newTask);
        resolve(newTask);
      } catch (err) {
        reject({
          code: err.code,
          details: err.details,
        });
      }
    });
  }

  async findAll(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.tasks);
      } catch (err) {
        reject({
          code: err.code,
          details: err.details,
        });
      }
    });
  }

  async filteredFind(filterDto: any): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      try {
        const { status, search } = filterDto;

        let tasks = this.tasks;

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
          details: err.details,
        });
      }
    });
  }

  async findOne(id: string): Promise<Task> {
    return new Promise((resolve, reject) => {
      try {
        const found = this.tasks.find((task) => task.id === id);

        if (!found) throw new Error('Task not found');

        resolve(found);
      } catch (err) {
        console.log(err.code, err.details);
        reject({
          code: err.code,
          details: err.details,
        });
      }
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return new Promise((resolve, reject) => {
      try {
        const task = this.tasks.find((task) => task.id === id);

        if (!task) throw new Error('Task not found');

        const updatedTask = {
          ...task,
          ...updateTaskDto,
        };

        this.tasks = this.tasks.map((task) =>
          task.id === id ? updatedTask : task,
        );

        resolve(updatedTask);
      } catch (err) {
        reject({
          code: err.code,
          details: err.details,
        });
      }
    });
  }

  async updateStatus(id: string, status: TaskStatus): Promise<Task> {
    return new Promise((resolve, reject) => {
      try {
        const task = this.tasks.find((task) => task.id === id);

        if (!task) throw new Error('Task not found');

        const updatedTask = {
          ...task,
          status,
        };

        this.tasks = this.tasks.map((task) =>
          task.id === id ? updatedTask : task,
        );

        resolve(updatedTask);
      } catch (err) {
        reject({
          code: err.code,
          details: err.details,
        });
      }
    });
  }

  async remove(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const found = this.findOne(id);

        if (!found) throw new Error('Task not found');

        this.tasks = this.tasks.filter((task) => task.id !== id);

        resolve();
      } catch (err) {
        reject({
          code: err.code,
          details: err.details,
        });
      }
    });
  }
}
