import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Login {
  @PrimaryGeneratedColumn({ name: 'login_id' })
  loginId: number;

  @Column({ name: 'third_party' })
  thirdParty: string;

  @ManyToOne(() => User, (user) => user.logins)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
