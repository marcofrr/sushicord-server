import * as graphql from 'graphql';
import * as _ from 'lodash';
import {GraphQLError} from 'graphql';

import User, { IUser } from '../models/user-model';
import Server, { ITextChannel } from '../models/server-model';
import { UserType,ServerType, FriendRequestType, PrivMessageType, UserNotificationType, ServerMessageType, FriendRequestUserType, ServerMessageUserType} from './type';

import {validateToken} from '../middlewares/validate-token';
import { AuthenticationError } from 'apollo-server-express';
import { IContext } from '../index'
import FriendRequest from '../models/friend-request-model';
import { GraphQLInt } from 'graphql';
import PrivateMessage from '../models/private-message-model'
import { getFriendRequests, getFriends } from './resolver/friend-resolver';
import { getChannelMessages, getMembers, getServers } from './resolver/server-resolver';
import { getChatList } from './resolver/priv-message-resolver';
const {GraphQLObjectType, GraphQLID, GraphQLList,GraphQLString, GraphQLNonNull } = graphql;
     
interface DirectMessage {
  userId : string;
  userName: string;
  status: string; 
  unreadMessages: number;
}

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    username: {
      type: UserType,
      args: { token: { type: GraphQLString } },
      async resolve(parent: any, args: any, context: IContext) {
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        const returnData = {
          email:  user?.email,
          userName: user?.userName,
          nickName: user?.nickName,
          birthDate: user?.birthDate,
        };
        return returnData
      },
    },
    User: {
      type: new GraphQLNonNull(UserType),
      args: {token: { type: GraphQLString }},
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');

        return user
      },

    },
    servers: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ServerType))),
      args: {token: { type: GraphQLString }},
      resolve: getServers,
    },
    friends: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      args: {token: { type: GraphQLString }},
      resolve: getFriends,
    },   
    FriendRequests: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(FriendRequestUserType))),
      args: {token: { type: GraphQLString }},
      resolve: getFriendRequests,
    },
    ServerData: {
      type: new GraphQLNonNull(ServerType),
      args: {
        token: { type: GraphQLString },
        serverId: { type: GraphQLString },
      },
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        if(!args.serverId) throw new GraphQLError('Server ID was not given!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');
        const server = await Server.findOne({_id: args.serverId});
        if (!server) return new GraphQLError('Server not found!');
        const isMember = server.users.find(x => x === user._id);
        if(!isMember) throw new AuthenticationError('User must be a member off the server!');

        return server
      },

    },PrivMessages: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PrivMessageType))),
      args: {
        token: { type: GraphQLString },
        senderId: { type: GraphQLString },
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');
        const messageList = await PrivateMessage.
          find({ $or:[{senderId:args.senderId, receiverId:user._id},{senderId:user._id, receiverId:args.senderId}]}).
          limit(args.limit).
          skip(args.offset).
          sort({createdAt: 'desc'})
        return messageList
      },

    },ChannelMessages: {
      type: new GraphQLList((ServerMessageUserType)),
      args: {
        token: { type: GraphQLString },
        serverId: { type: GraphQLString },
        channelId: { type: GraphQLString },
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      resolve: getChannelMessages,
    },
    ChatList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserNotificationType))),
      args: {
        token: { type: GraphQLString },
      },
      resolve: getChatList,
    },
    ServerMembers: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      args: {
        token: { type: GraphQLString },
        serverId: { type: GraphQLString },
      },
      resolve:getMembers,
    },  
  },
});
