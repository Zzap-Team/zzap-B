import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/user.entity';
import { LoginModule } from './modules/login/login.module';
import { Login } from './modules/login/login.entity';
import { ArticlesModule } from './modules/article/articles.module';
import { Article } from './modules/article/article.entity';
import { HttpModule } from './modules/http/http.module';
import { AuthModule } from './modules/auth/auth.module';
import { EnvironmentVariables, configuration } from './configuration';
import { formatWithCursor } from 'prettier';
import { ApolloServerErrorCode } from '@apollo/server/dist/esm/errors';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env.development'], // don't touch the order! if the order changed, env precedense mass
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => {
        const db = config.get('db', { infer: true });
        return {
          type: 'mariadb',
          host: db.host,
          port: db.port,
          username: db.user,
          password: db.password,
          database: db.database,
          entities: [User, Login, Article],
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // change 'false' at Production Env})
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      context: ({ req, res }) => ({
        req,
        res,
      }),
    }),
    UsersModule,
    LoginModule,
    ArticlesModule,
    AuthModule,
    HttpModule,
  ],
})
export class AppModule {}
