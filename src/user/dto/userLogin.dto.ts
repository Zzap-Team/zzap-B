import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';

@InputType()
export class UserLoginDTO {
  @Field()
  @IsString()
  @IsEmail()
  @MaxLength(60)
  email: string;

  @Field()
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%&*()]{8,30}$/)
  password: string;
}
