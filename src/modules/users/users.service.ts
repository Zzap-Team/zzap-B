import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByID(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ userId: id });
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async create(name: string, email: string): Promise<User> {
    const newUser = this.userRepository.save({ name, email });
    return newUser;
  }

  async delete(id: number) {
    return this.userRepository.softRemove({ userId: id });
  }

  async update(id: number, name?: string, email?: string) {
    const user = await this.userRepository.findOneBy({ userId: id });
    user.name = name;
    user.email = email;
    return this.userRepository.save(user);
  }
}
