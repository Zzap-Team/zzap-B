import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Response = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const response = GqlExecutionContext.create(context).getContext().req.res;
    return response;
  },
);
