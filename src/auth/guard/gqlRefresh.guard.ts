import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { RefreshGuard } from './jwtRefresh.guard';

// refresh token이 유효한지 검사 - gql
@Injectable()
export class GqlRefreshGurad extends RefreshGuard {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = GqlExecutionContext.create(context).getContext().req;
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new AuthenticationError('Can not find refresh token');
    }
    try {
      const { uid } = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      request['uid'] = uid;
    } catch {
      throw new AuthenticationError('Refresh token is expired');
    }
    return true;
  }
}
