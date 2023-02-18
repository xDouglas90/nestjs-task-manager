import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@Injectable()
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  description: string;
}
