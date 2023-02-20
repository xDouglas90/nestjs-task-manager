import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CredentialDto } from './dto/credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto): Promise<UserEntity> {
    return await this.createUser(user);
  }

  async login(credential: CredentialDto): Promise<{ token: string }> {
    const { email, password } = credential;

    const verifiedUser = await this.checkCredentials(email, password);

    if (verifiedUser === null)
      throw new UnauthorizedException('Invalid email or password');

    const jwtPayload = {
      sub: verifiedUser.id,
      email,
    };

    const token = await this.jwtService.sign(jwtPayload);
    return { token };
  }

  validateToken(jwtToken: string) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(
          await this.jwtService.verifyAsync(jwtToken, {
            ignoreExpiration: false,
          }),
        );
      } catch (error) {
        reject({
          code: 401,
          detail: 'JWT expired.',
        });
      }
    });
  }

  async checkCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    let user: UserEntity | null;

    try {
      user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
    } catch (err) {
      return null;
    }

    const isPasswordValid = await user.validatePassword(password);

    if (user && isPasswordValid) return user;

    return null;
  }

  decodedToken(jwtToken: string) {
    return this.jwtService.decode(jwtToken);
  }

  private async createUser(user: CreateUserDto): Promise<UserEntity> {
    return new Promise(async (resolve, reject) => {
      try {
        const { email, password, firstName, lastName } = user;

        const userEntity = this.userRepository.create();
        userEntity.email = email;
        userEntity.firstName = firstName;
        userEntity.lastName = lastName;
        userEntity.salt = await bcrypt.genSalt(12);
        userEntity.password = await this.hashPassword(
          password,
          userEntity.salt,
        );
        userEntity.confirmationToken = '';
        userEntity.recoverToken = '';

        const newUser = await this.userRepository.save(userEntity);

        delete newUser.password;
        delete newUser.salt;

        resolve(newUser);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.detail,
        });
      }
    });
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(password, salt);
        resolve(hashedPassword);
      } catch (err) {
        reject({
          code: err.code,
          detail: err.detail,
        });
      }
    });
  }
}
