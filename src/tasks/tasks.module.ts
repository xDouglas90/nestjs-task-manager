import { Module } from '@nestjs/common';
import { databaseProvider } from 'src/core/database/database.provider';
import { taskRepository } from './providers/task-repository.provider';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [...databaseProvider, ...taskRepository, TasksService],
})
export class TasksModule {}
