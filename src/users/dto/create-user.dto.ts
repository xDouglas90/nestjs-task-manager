import { Injectable } from '@nestjs/common';
import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helpers';
import { RegexHelper } from 'src/helpers/regex.helpers';

@Injectable()
export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  @Matches(RegexHelper.nameRegex, {
    message: MessagesHelper.INVALID_NAME,
  })
  readonly firstName: string;

  @IsString()
  @Length(1, 50)
  @Matches(RegexHelper.nameRegex, {
    message: MessagesHelper.INVALID_NAME,
  })
  readonly lastName: string;

  @IsEmail()
  @Length(5, 255)
  @Matches(RegexHelper.emailRegex, {
    message: MessagesHelper.INVALID_EMAIL,
  })
  readonly email: string;

  @IsString()
  @Length(8, 100)
  @Matches(RegexHelper.passwordRegex, {
    message: MessagesHelper.INVALID_PASSWORD,
  })
  readonly password: string;
}
