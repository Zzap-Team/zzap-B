import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const Uid = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = GqlExecutionContext.create(context).getContext().req;
    console.log('req', request);
    const uid = request['uid'];
    return uid;
  },
);
