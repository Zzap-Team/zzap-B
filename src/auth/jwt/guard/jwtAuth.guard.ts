import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      throw new UnauthorizedException('Can not find access token');
    }
    /* TODO:
    1. separate userEntity and tokenEntity in TypeORM(tokenEntity has token, tokenType).
    2. find tokenType to use findOne Query in tokenEntity.
    3. implement verification user logic for each token type. 
    */
    try {
      const { uid } = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
      request['uid'] = uid;
    } catch {
      throw new UnauthorizedException('Your access token is expired');
    }
    return true;
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
