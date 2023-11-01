import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserDTO {
  // 2글자~30글자
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @Field()
  @IsString()
  @IsEmail()
  @MaxLength(60)
  email: string;

  // 영문 대소문자, 숫자, 특수문자로 이뤄진 8~30글자
  @Field()
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%&*()]{8,30}$/)
  password: string;
}
