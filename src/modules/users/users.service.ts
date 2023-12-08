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

  async findOneByID(id: number, withDeleted = false): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      withDeleted,
    });
    return user;
  }

  async findOneByEmail(
    email: string,
    withDeleted = false,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted,
    });
    return user;
  }

  async create(name: string, email: string): Promise<User> {
    // TODO: 설계 고쳐야됨.
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (user == null) return this.userRepository.save({ name, email });
    return user;
  }

  async delete(id: number) {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (user == null) throw new Error('user is not exist');
    return this.userRepository.softRemove(user);
  }

  async update(id: number, name?: string, email?: string) {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (user == null) throw new Error('user is not exist.');
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    return this.userRepository.save(user);
  }

  async articles(id: number) {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (user == null) throw new Error('user is not exist.');
    return user.articles;
  }
}
