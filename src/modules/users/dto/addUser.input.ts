import { IsEmail } from 'class-validator';
import { UserInput as User } from 'src/graphql';

export class AddUserInput extends User {
  @IsEmail()
  email: string;
}
