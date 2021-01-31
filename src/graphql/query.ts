import * as graphql from 'graphql';

import User, { IUser } from '../models/user-model';
import Server from '../models/server-model';
import { UserType,ServerType, FriendRequestType, PrivMessageType} from './type';

import {validateToken} from '../middlewares/validate-token';
import { extendSchemaImpl } from 'graphql/utilities/extendSchema';
import { AuthenticationError } from 'apollo-server-express';
import { IContext } from '../index'
import FriendRequest from '../models/friend-request-model';
import { GraphQLInt } from 'graphql';
import PrivateMessage from '../models/private-message-model'
const {GraphQLObjectType, GraphQLID, GraphQLList,GraphQLString, GraphQLNonNull } = graphql;

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
        // const serverList = await Server.find({users : {$elemMatch : {_id: user._id}}}).sort({name:'asc'})
        //console.log(context.user)
        return friendRequest
      },

    },PrivMessages: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PrivMessageType))),
      args: {
        token: { type: GraphQLString },
        senderId: { type: GraphQLString },
        receiverId: { type: GraphQLString },
        offset: { type: GraphQLInt },
        limit: { type: GraphQLInt }
      },
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');

        const messageList = await PrivateMessage.find({ senderId:args.senderId, receiverId:args.receiverId}).
          limit(args.limit).
          skip(args.offset).
          sort({createdAt: 'desc'})
        return messageList
      },

    },
    ChatList: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      args: {
        token: { type: GraphQLString },
        userId: { type: GraphQLString },
      },
      async resolve(parent: any, args: any, context: IContext) {
        if(!args.token)throw new AuthenticationError('Token not found!');
        const {id} = validateToken(args.token);
        const user = await User.findOne({_id: id});
        if(!user) throw new AuthenticationError('User not found!');
        const messageList = await PrivateMessage.aggregate( [
          {
            $match : { "receiverId": { $gte: args.userId} }
          },
          {
            $group: {
              _id: "$senderId",
               count: { $sum: 1 }
            }
          },{ $sort: { count: -1 } }
        ] )
        const list : IUser[] = [];

        for(const element of messageList){
          const user = await User.findOne({_id: element._id})
          if(user) list.push(user)

        }
        return list
      },

    },   
  },
});
