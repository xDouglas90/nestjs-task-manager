import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class GetUsersFilterDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly search: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly email: string;
}
