import * as graphql from 'graphql';
import * as _ from 'lodash';

import User, { IUser } from '../models/user-model';
import Server from '../models/server-model';
import { UserType,ServerType, FriendRequestType, PrivMessageType, UserNotificationType} from './type';

import {validateToken} from '../middlewares/validate-token';
import { AuthenticationError } from 'apollo-server-express';
import { IContext } from '../index'
import FriendRequest from '../models/friend-request-model';
import { GraphQLInt } from 'graphql';
import PrivateMessage from '../models/private-message-model'
const {GraphQLObjectType, GraphQLID, GraphQLList,GraphQLString, GraphQLNonNull } = graphql;

interface INotificationUser  {
  user: IUser;
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
    servers: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ServerType))),
      args: {token: { type: GraphQLString }},
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');
        const serverList = await Server.find({users : {$elemMatch : {_id: user._id}}}).sort({name:'asc'})
        //console.log(context.user)
        return serverList
      },
    },
    friends: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      args: {token: { type: GraphQLString }},
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');
        // const serverList = await Server.find({users : {$elemMatch : {_id: user._id}}}).sort({name:'asc'})
        //console.log(context.user)
        return user.friends
      },
    },  
    FriendRequests: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(FriendRequestType))),
      args: {token: { type: GraphQLString }},
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');

        const friendRequest = await FriendRequest.find({'receiver._id' : id});
        return friendRequest
      },

    },ServerData: {
      type: new GraphQLNonNull((PrivMessageType)),
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

    }
    
    ,PrivMessages: {
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

    },
    ChatList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserNotificationType))),
      args: {
        token: { type: GraphQLString },
      },
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');

        const lastMessages = await PrivateMessage.find({ receiverId:user._id}).sort({ createdAt: -1});
        const lastMessagesByUser = _.uniqBy(lastMessages,'senderId');
   
        const res: INotificationUser[]=[];

        for(const item of lastMessagesByUser){
          const u =  await User.findOne({_id: item.senderId});
          if(u){
            const unreadMessages = await PrivateMessage.find({senderId: item.senderId, isSeen:false}).countDocuments()

            const aux : INotificationUser = {
              user: u,
              unreadMessages:unreadMessages
            }
            res.push(aux)
          }

        }
        return res  
      },

    },   
  },
});
