import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schema/user.entity';
import { CreateUserDTO } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByID(uid: string): Promise<User> {
    return await this.userRepository.findOneBy({ uid: uid });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  private async exist(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOneBy({ email: email }));
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = new User();
    const isExist = await this.exist(createUserDTO.email);
    if (isExist) throw new Error('Error: This account already exists');

    newUser.uid = uuidv4();
    newUser.name = createUserDTO.name;
    newUser.email = createUserDTO.email;
    newUser.password = await bcrypt.hash(createUserDTO.password, 10);
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

  async setJwtRefreshToken(refreshToken: string, uid: string) {
    const hashedRefreshToken =
      refreshToken !== '' ? await bcrypt.hash(refreshToken, 10) : '';
    await this.userRepository.update(uid, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }

  async getUidIfRefreshTokenMatches(
    refreshToken: string,
    uid: string,
  ): Promise<string> {
    const user = await this.findOneByID(uid);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return uid;
    } else return '';
  }

  async removeRefreshToken(uid: string) {
    return this.userRepository.update(uid, {
      hashedRefreshToken: null,
    });
  }
}
