import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RefreshToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const [type, token] = gqlContext.req.headers.cookie?.split('=') ?? [];
    return token;
  },
);
