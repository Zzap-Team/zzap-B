import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

@InputType()
export class SignInDTO {
  @Field()
  @IsString()
  @IsEmail()
  @MinLength(2)
  @MaxLength(30)
  email: string;

  @Field()
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%&*()]{8,30}$/)
  password: string;
}
