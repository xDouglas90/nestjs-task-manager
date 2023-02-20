import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { jwtConstants } from 'src/auth/constants';
import { databaseProvider } from 'src/core/database/database.provider';
import { taskRepository } from './providers/task-repository.provider';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: jwtConstants.expiresIn },
      }),
    }),
  ],
  controllers: [TasksController],
  providers: [...databaseProvider, ...taskRepository, TasksService],
})
export class TasksModule {}
