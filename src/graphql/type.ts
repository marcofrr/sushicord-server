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

export const ChannelType = new GraphQLObjectType({
  name: 'Channel',
  fields: () => ({
    name: {type: GraphQLString},
    server: {type: UserType},
  }),
});
// export const ChannelType = new GraphQLObjectType({
//   name: 'Channel',
//   fields: () => ({
//     id: {type: new GraphQLNonNull(GraphQLID)},
//     name: {type: new GraphQLNonNull(GraphQLString)},
//     serverId: {type: new GraphQLNonNull(GraphQLID)},
//   }),
// });

export const ServerType = new GraphQLObjectType({
  name: 'Server',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    owner: {type: UserType},
    users: {type: new GraphQLList(GraphQLString)},
  }),
});

export const ServerInviteType = new GraphQLObjectType({
  name: 'ServerInvite',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    server: {type: new GraphQLNonNull(GraphQLString)},
  }),
});

export const JoinServerType = new GraphQLObjectType({
  name: 'JoinServer',
  fields: () => ({
    serverId: {type: new GraphQLNonNull(GraphQLString)},
  }),
});
