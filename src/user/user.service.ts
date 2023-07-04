import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schema/user.entity';
import { CreateUserDTO } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(uid: string): Promise<User> {
    return await this.userRepository.findOneBy({ uid: uid });
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = new User();
    newUser.uid = uuidv4();
    newUser.name = createUserDTO.name;
    newUser.email = createUserDTO.email;
    newUser.password = createUserDTO.password;
    newUser.createdAt = new Date();
    return await this.userRepository.save(newUser);
  }

  async delete(uid: string): Promise<boolean> {
    try {
      await this.userRepository.delete(uid);
    } catch (e) {
      throw new Error(e);
    }
    return true;
  }
}
