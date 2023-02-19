import { Injectable } from '@nestjs/common';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { RegexHelper } from 'src/helpers/regex.helpers';

@Injectable()
export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  @Matches(RegexHelper.nameRegex, {
    message: 'First name is not valid.',
  })
  firstName: string;

  @IsString()
  @Length(1, 50)
  @Matches(RegexHelper.nameRegex, {
    message: 'Last name is not valid.',
  })
  lastName: string;

  @IsEmail()
  @Length(5, 255)
  @Matches(RegexHelper.emailRegex, {
    message: 'Email is not valid.',
  })
  email: string;

  @IsString()
  @Length(8, 100)
  @Matches(RegexHelper.passwordRegex, {
    message:
      'Password too weak. Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;
}
