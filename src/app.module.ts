import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UserModule } from './user/user.module';
import { User } from './user/schema/user.entity';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/jwt/jwtAuth.module';
import { OauthModule } from './auth/oauth/oauth.module';

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
      context: ({ req, connection }) => {
        //graphql에게 request를 요청할때 req안으로 jwt토큰이 담깁니다.
        if (req) {
          const user = req.headers.authorization;
          return { ...req, user };
        } else {
          return connection;
        }
      },
      //playground: false, 주소: http://localhost:3000/graphql
    }),
    UserModule,
    ArticleModule,
    AuthModule,
    OauthModule,
  ],
})
export class AppModule {}
