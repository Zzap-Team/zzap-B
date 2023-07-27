import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthenticationError } from 'apollo-server-express';

import { UserModule } from './user/user.module';
import { User } from './model/user.entity';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/jwt/jwtAuth.module';
import { OauthModule } from './auth/oauth/oauth.module';
import { formatError } from './formatError';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + `/**/*.entity{.ts,.js}`],
      synchronize: process.env.DB_SYNCHRONIZE === 'true', // change 'false' at Production Env
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      formatError: formatError,
      context: ({ req, connection }) => {
        //graphql에게 request를 요청할때 req안으로 jwt토큰이 담깁니다.
        if (req) {
          const token = req.headers.authorization;

          return { ...req, token };
        } else {
          return connection;
        }
      },
      //playground: false
    }),
    UserModule,
    ArticleModule,
    AuthModule,
    OauthModule,
  ],
})
export class AppModule {}
