import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthenticationError } from 'apollo-server-express';

import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/user.entity';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/jwt/jwtAuth.module';
import { OauthModule } from './auth/oauth/oauth.module';
import { formatError } from './formatError';
import { join } from 'path';
import { Login } from './modules/login/login.entity';
import { LoginModule } from './modules/login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'], // don't touch the order! if the order changed, env precedense mass
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '7410',
      database: 'zzap',
      entities: [User, Login],
      // entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // change 'false' at Production Env
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    UsersModule,
    LoginModule,
  ],
})
export class AppModule {}
