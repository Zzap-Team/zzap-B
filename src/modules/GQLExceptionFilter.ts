import { Catch, BadRequestException } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';

@Catch(BadRequestException)
export class GqlValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: BadRequestException, _: GqlArgumentsHost) {
    const res = exception.getResponse();

    return new UserInputError(res['message']);
  }
}
