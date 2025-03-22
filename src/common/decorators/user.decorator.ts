/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // console.log('User Decorator - Request User:', request.user);
    const user = request.user;
    if (!user) {
      return undefined; // Or throw an error if user should always be defined
    }
    return data ? user['sub'] : user;
  },
);
