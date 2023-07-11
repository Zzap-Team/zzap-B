import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

// refresh token이 유효한지 검사
@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(protected jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Can not find access token');
    }
    try {
      const { uid } = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      request['uid'] = uid;
      console.log(uid);
    } catch {
      throw new UnauthorizedException('Your access token is expired');
    }
    return true;
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.cookie?.split('=') ?? [];
    console.log(request.headers);
    return type === 'Refresh' ? token : undefined;
  }
}
