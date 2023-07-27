import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';
import { CreateUserDTO } from './dto/createUser.dto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ApolloError, UserInputError } from 'apollo-server-express';

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
    const user = await this.userRepository.findOneBy({ uid: uid });
    if (user) {
      return user;
    } else
      throw new UserInputError('Can not found user at database', {
        data: 'User',
      });
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (user) {
      return user;
    } else
      throw new UserInputError('Can not found user at database', {
        data: 'User',
      });
  }

  private async exist(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOneBy({ email: email }));
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = new User();
    const isExist = await this.exist(createUserDTO.email);
    if (isExist)
      throw new ApolloError('This account already exists.', 'INVALID_VALUE');

    newUser.uid = uuidv4();
    newUser.name = createUserDTO.name;
    newUser.createdAt = new Date();
    newUser.articles = null;
    newUser.email = createUserDTO.email;
    newUser.password = await bcrypt.hash(createUserDTO.password, 10);
    return await this.userRepository.save(newUser);
  }

  async createWithUid(
    createUserDTO: CreateUserDTO,
    uid: string,
  ): Promise<User> {
    const newUser = new User();
    const isExist = await this.exist(createUserDTO.email);
    if (isExist)
      throw new ApolloError('Email does not exist.', 'NONEXISTENT_VALUE', {
        argumentName: 'email',
      });
    newUser.uid = uid;
    newUser.name = createUserDTO.name;
    newUser.createdAt = new Date();
    newUser.articles = null;
    newUser.email = createUserDTO.email;
    if (createUserDTO.password === null) newUser.password = null;
    else newUser.password = await bcrypt.hash(createUserDTO.password, 10);
    return await this.userRepository.save(newUser);
  }

  async delete(uid: string): Promise<boolean> {
    try {
      await this.userRepository.delete(uid);
    } catch (e) {
      return false;
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

  async setOauthToken(token: string, uid: string) {
    await this.userRepository.update(uid, {
      hashedRefreshToken: token,
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
    } else return undefined;
  }

  async removeRefreshToken(uid: string) {
    return this.userRepository.update(uid, {
      hashedRefreshToken: null,
    });
  }
}
