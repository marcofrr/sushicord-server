import * as _ from 'lodash';
import * as mongoose from 'mongoose';
import {GraphQLError} from 'graphql';
import {IContext} from '../../index';
import User, {STATUS, IFriend} from '../../models/user-model';
import {IFriendRequest} from '../../models/friend-request-model'
import { AuthenticationError } from 'apollo-server-express';
import FriendRequest from '../../models/friend-request-model';
import { pubsub } from '../pubsub';
import { validateToken } from '../../middlewares/validate-token';

interface getFriendRequestsRes  {
    friendRequest: IFriendRequest;
    sender: IUser;
};
export interface IUser{
  _id: string;
  email: string;
  userName: string;
  nickName: string;
  password: string;
  birthDate: string;
  status: STATUS;
  friends: [IFriend];
}
export async function createFriendRequest(
    parent: any,
    args: any,
    context: IContext,
  ): Promise<IFriendRequest | Error> {
  
    if (!context.user) throw new AuthenticationError('User not found!');
    if(!args.receiverId) throw new GraphQLError('ID not found!');
    const receiver = await User.findOne({_id: args.receiverId});
    if(!receiver) throw new GraphQLError('User not Found!');
    //check if already friends
  
    const friendRequest = new FriendRequest ({
      _id:new mongoose.Types.ObjectId().toHexString(),
      senderId: context.user._id,
      receiverId: args.receiverId,
      })
    
      pubsub.publish("newFriendRequest", {
        newFriendRequest: {
          friendRequest,
          sender: context.user
        }
      })
  
      return await friendRequest.save();
  }


  export async function handleFriendRequest(
    parent: any,
    args: any,
    context: IContext,
  ): Promise< IFriendRequest | Error> {
  
    if (!context.user) throw new AuthenticationError('User not found!');
    if(!args.action) throw new GraphQLError('Action not found!');
  
    const friendRequest = await FriendRequest.findOne({_id: args.requestId})
  
    if(!friendRequest) throw new GraphQLError('Friend Request not Found!')
  
    const sender = await User.findOne({_id: friendRequest.senderId})
    if(!sender) throw new GraphQLError('The sender of this request was not found!')
    if(args.action === 'accept'){
      //receiver
      const friend1: IFriend = {
        _id: context.user._id,
      }
      //sender
      const friend2: IFriend = {
        _id: sender._id,
      }
      context.user.friends.push(friend2);
      sender.friends.push(friend1);
      await context.user.save()
      await sender.save()
    }
    friendRequest.deleteOne()
    return friendRequest;
  
  }


export async function getFriendRequests(
    parent: any,
    args: any,
    context: IContext
  ): Promise<getFriendRequestsRes[] | Error> {
    if(!args.token)throw new AuthenticationError('Token not found!');
    const {id} = validateToken(args.token);
    const user = await User.findOne({_id: id});
    if(!user) throw new AuthenticationError('User not found!');
    var res : any = [];
    const requests = await FriendRequest.find({'receiverId' : id});
    for(var i =0; i< requests.length; i++){
        const sender = await User.findOne({_id : requests[i].senderId})
        if(!sender) throw new AuthenticationError('User not found!');
        const entry: getFriendRequestsRes = {
            friendRequest: requests[i],
            sender: sender
        }
        res.push(entry)
    }
    return res
  }

  export async function getFriends(
    parent: any,
    args: any,
    context: IContext
  ): Promise<IUser[] | Error> {
    if(!args.token)throw new AuthenticationError('Token not found!');
    const {id} = validateToken(args.token);
    const user = await User.findOne({_id: id});
    if(!user) throw new AuthenticationError('User not found!');
    var res : IUser[]= [];
    const friendList = user.friends
    for(var i =0; i< friendList.length; i++){
        const friend = await User.findOne({_id : friendList[i]._id})
        if(!friend) throw new AuthenticationError('User not found!');
        // const entry: getFriendRequestsRes = {
        //     friendRequest: friendList[i],
        //     sender: sender
        // }
        res.push(friend)
    }
    return res
  }
