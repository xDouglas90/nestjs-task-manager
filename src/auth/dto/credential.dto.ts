import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { MessagesHelper } from 'src/helpers/messages.helpers';
import { RegexHelper } from 'src/helpers/regex.helpers';

@Injectable()
export class CredentialDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(RegexHelper.emailRegex, {
    message: MessagesHelper.INVALID_EMAIL,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(RegexHelper.passwordRegex, {
    message: MessagesHelper.INVALID_PASSWORD,
  })
  password: string;
}
