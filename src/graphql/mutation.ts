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
  ServerMessageType,
  FriendRequestType,
  PrivMessageType,
} from './type';
import {signup, login} from './resolver/user-resolver';
import {
  createServer,
  joinServer,
  createMessage,
  createTextChannel,
} from './resolver/server-resolver';
import {
  createFriendRequest,
  handleFriendRequest
} from  './resolver/friend-resolver'
import { createPrivMessage, getPrivMessage, toggleUnseenMessages } from './resolver/priv-message-resolver';


export const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args: {
        email: {type: new GraphQLNonNull(GraphQLString)},
        userName: {type: new GraphQLNonNull(GraphQLString)},
        password: {type: new GraphQLNonNull(GraphQLString)},
        birthDate: {type: new GraphQLNonNull(GraphQLString)},
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
    createTextChannel: {
      type: ServerType,
      args: {
        serverId: {type: new GraphQLNonNull(GraphQLString)},
        channelName: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: createTextChannel,
    },
    joinServer: {
      type: ServerType,
      args: {
        shortId: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: joinServer,
    },
    sendServerMessage: {
      type: ServerMessageType,
      args: {
        serverId: {type: new GraphQLNonNull(GraphQLString)},
        channelId: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: createMessage,
    },
    createFriendRequest: {
      type: FriendRequestType,
      args: {
        receiverId: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: createFriendRequest,
    },
    handleFriendRequest: {
      type: FriendRequestType,
      args: {
        action: {type: new GraphQLNonNull(GraphQLString)},
        requestId: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: handleFriendRequest,
    },
    sendPrivMessage: {
      type: PrivMessageType,
      args: {
        receiverId: {type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: createPrivMessage,
    },
    toggleUnseenMessages: {
      type: UserType,
      args: {
        senderId: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve: toggleUnseenMessages,
    },
  },
});
