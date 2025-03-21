import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // console.log('AuthGuard handleRequest called');
    if (err) {
      console.error('AuthGuard error:', err);
      throw new UnauthorizedException('Access denied');
    }
    if (!user) {
      console.error('AuthGuard user is null or undefined');
      throw new UnauthorizedException('Access denied');
    }

    // console.log('AuthGuard user:', user); // Log the user object
    const request = context.switchToHttp().getRequest<{ user?: any }>();
    request.user = user;
    // console.log('Request user after setting:', request.user); // Log request.user after setting
    return user;
  }
}
