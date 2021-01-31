import {GraphQLSchema} from 'graphql';

import {RootQuery} from './query';
import {Mutation} from './mutation';
import {Subscription} from './subscriptions'
export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
  subscription: Subscription
});
