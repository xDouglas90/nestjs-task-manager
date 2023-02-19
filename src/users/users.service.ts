import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async insert(user: CreateUserDto): Promise<UserEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.usersRepository.insert(user);

        const { id } = response.generatedMaps[0];

        const created: UserEntity = new UserEntity();

        created.id = id;
        created.firstName = user.firstName;
        created.lastName = user.lastName;
        created.email = user.email;
        created.password = user.password;

        await this.usersRepository.save(created);

        resolve(created);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.details,
        });
      }
    });
  }

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
        const userToUpdate = await this.findOne(id);

        if (!userToUpdate) reject({ code: 404, detail: 'User not found' });

        const updated = await this.usersRepository.merge(userToUpdate, user);

        await this.usersRepository.save(updated);

        resolve(updated);
      } catch (err) {
        console.log(err);
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
        const response = await this.usersRepository.delete(id);
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
