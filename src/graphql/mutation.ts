import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';

import {
  UserType,
  TokenType,
  ChannelType,
  ServerType,
  ServerInviteType,
  JoinServerType,
} from './type';
import {signup, login} from './resolver/user-resolver';
import {
  createChannel,
  createInvite,
  createServer,
  joinServer,
} from './resolver/server-resolver';

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
    createServer: {
      type: ServerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: createServer,
    },
    createServerChannel: {
      type: ChannelType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: createChannel,
    },
    createServerInvite: {
      type: ServerInviteType,
      args: {
        serverId: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: createInvite,
    },
    joinServer: {
      type: JoinServerType,
      args: {
        server: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: joinServer,
    },
  },
});
