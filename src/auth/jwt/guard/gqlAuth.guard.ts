import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      throw new UnauthorizedException('Can not find access token');
    }
    try {
      this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Your access token is expired');
    }
    return true;
  }
}
