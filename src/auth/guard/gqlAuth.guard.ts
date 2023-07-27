import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationError, ApolloError } from 'apollo-server-express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { AuthGuard } from './jwtAuth.guard';

// access token이 유효한지 검사 - gql
@Injectable()
export class GqlAuthGurad extends AuthGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = GqlExecutionContext.create(context).getContext().req;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new ApolloError('Can not find access token', 'UNAUTHORIZED');
    }
    try {
      const { uid } = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      request['uid'] = uid;
    } catch {
      throw new ApolloError('Access token is expired', 'UNAUTHORIZED');
    }
    return true;
  }
}
