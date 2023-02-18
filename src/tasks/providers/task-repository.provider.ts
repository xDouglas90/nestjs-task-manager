import { DataSource } from 'typeorm';
import { TaskEntity } from '../entities/task.entity';

export const taskRepository = [
  {
    provide: 'TASK_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TaskEntity),
    inject: ['DATA_SOURCE'],
  },
];
