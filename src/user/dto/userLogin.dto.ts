import { Field, InputType } from '@nestjs/graphql';
import { IsString, Matches, MinLength, MaxLength } from 'class-validator';

@InputType()
export class UserLoginDTO {
  @Field()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @Field()
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%&*()]{8,30}$/)
  password: string;
}
