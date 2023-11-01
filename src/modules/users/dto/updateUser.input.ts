import { IsEmail, IsOptional } from 'class-validator';
import { UserInput as User } from 'src/graphql';

export class UpdateUserInput extends User {
  @IsEmail()
  @IsOptional()
  email: string;
}
