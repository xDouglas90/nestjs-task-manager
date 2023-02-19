import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
  async insert(@Body() user: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.usersService.insert(user);
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
  async findOne(@Param('id') id: string): Promise<UserEntity> {
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
  async update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
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
  async remove(@Param() id: string): Promise<void> {
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
