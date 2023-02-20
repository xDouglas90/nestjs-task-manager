import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { MessagesHelper } from 'src/helpers/messages.helpers';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  async find(filterDto: GetUsersFilterDto): Promise<UserEntity[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const { search, email } = filterDto;

        const query = this.usersRepository.createQueryBuilder('user');

        if (search)
          query.andWhere(
            '(LOWER(user.first_name) LIKE LOWER(:search) OR LOWER(user.last_name) LIKE LOWER(:search))',
            { search: `%${search}%` },
          );

        if (email) query.andWhere('user.email = :email', { email });

        const users = await query.getMany();

        resolve(users);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.detail,
        });
      }
    });
  }

  async findOne(id: string): Promise<UserEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.usersRepository.findOne({
          where: { id },
          select: [
            'id',
            'firstName',
            'lastName',
            'email',
            'createdAt',
            'updatedAt',
          ],
        });

        if (!user) reject({ code: 404, detail: 'User not found' });

        resolve(user);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.detail,
        });
      }
    });
  }

  async update(id: string, user: UpdateUserDto): Promise<UserEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const userToUpdate = await this.usersRepository.findOne({
          where: { id },
        });
        const updateParams = { ...user };

        if (!userToUpdate)
          reject({ code: 404, detail: MessagesHelper.USER_NOT_FOUND });

        if (user.password) {
          const isSame = await bcrypt.compare(
            user.password,
            userToUpdate.password,
          );

          if (isSame) {
            reject({
              code: 400,
              detail: MessagesHelper.SAME_PASSWORD,
            });
          }

          const password = await this.authService.hashPassword(
            user.password,
            userToUpdate.salt,
          );

          updateParams.password = password;
        }

        const updated = await this.usersRepository.merge(
          userToUpdate,
          updateParams,
        );

        await this.usersRepository.save(updated);

        resolve(updated);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.detail,
        });
      }
    });
  }

  async remove(id: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.usersRepository.softDelete(id);
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
          detail: err.detail,
        });
      }
    });
  }
}
