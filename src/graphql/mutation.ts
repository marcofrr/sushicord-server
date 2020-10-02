import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

import {UserType, TokenType} from './type';
import {signup, login} from './resolver/user-resolver';

export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        userName: {type: new GraphQLNonNull(GraphQLString)},
        nickName: {type: GraphQLString},
        password: {type: new GraphQLNonNull(GraphQLString)},
        birthDate: {type: new GraphQLNonNull(GraphQLString)},
        status: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: signup,
    },
    login: {
      type: TokenType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: login,
    },
  },
});
