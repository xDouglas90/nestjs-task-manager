import { Module } from '@nestjs/common';
import { databaseProvider } from 'src/core/database/database.provider';
import { userRepository } from './providers/user-repository.provider';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

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
  controllers: [UsersController],
  providers: [...databaseProvider, ...userRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
