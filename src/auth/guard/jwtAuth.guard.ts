import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// access token이 유효한지 검사
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new AuthenticationError('Can not find access token');
    }
    try {
      const { uid } = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      request['uid'] = uid;
    } catch {
      throw new AuthenticationError('Your access token is expired');
    }
    return true;
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
