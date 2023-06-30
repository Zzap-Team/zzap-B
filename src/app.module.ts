import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:['.env.development'],
  }), 
  TypeOrmModule.forRoot({
    type : "mariadb",
    host : process.env.DB_HOST,
    port : parseInt(process.env.DB_PORT),
    username : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    entities : [User],
    synchronize : true,
  }),
  UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
