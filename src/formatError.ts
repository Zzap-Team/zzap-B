import { GraphQLError } from 'graphql';

export const formatError = (err: GraphQLError) => {
  console.error('--- GraphQL Error ---');
  console.error('Path:', err.path);
  console.error('Message:', err.message);
  console.error('Code:', err.extensions.code);
  console.error('Original Error', err.originalError);
  return err;
  //   const graphQLFormattedError: GraphQLFormattedError = {
  //     message: error.extensions?.exception?.response?.message || error.message,
  //   };
};
