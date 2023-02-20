import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('api/v1/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async find(@Query() filterDto: GetUsersFilterDto): Promise<UserEntity[]> {
    try {
      return await this.usersService.find(filterDto);
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.detail,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async signUp(@Body() user: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.authService.signUp(user);
    } catch (err) {
      throw new HttpException(
        {
          reason: err?.details,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserEntity> {
    try {
      return this.usersService.findOne(id);
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
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUser: UpdateUserDto,
  ) {
    try {
      return await this.usersService.update(id, updateUser);
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
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    try {
      await this.usersService.remove(id);
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
