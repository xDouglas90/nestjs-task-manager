import { Module } from '@nestjs/common';
import { databaseProvider } from 'src/core/database/database.provider';
import { userRepository } from './providers/user-repository.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [...databaseProvider, ...userRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
