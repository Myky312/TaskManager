import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// In your User decorator:
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: any }>();
    // console.log('User Decorator - Request User:', request.user);
    return data ? (request.user as Record<string, any>)?.[data] : request.user;
  },
);
