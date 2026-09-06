import { IsEmail, IsNotEmpty, IsString, MinLength, Length } from 'class-validator';

export class SchoolLoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  schoolCode: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
