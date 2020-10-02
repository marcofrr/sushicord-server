import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    userName: {type: new GraphQLNonNull(GraphQLString)},
    nickName: {type: GraphQLString},
    password: {type: new GraphQLNonNull(GraphQLString)},
    birthDate: {type: new GraphQLNonNull(GraphQLString)},
    status: {type: GraphQLString},
  }),
});

export const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: {type: GraphQLString},
    user: {type: UserType},
  }),
});
