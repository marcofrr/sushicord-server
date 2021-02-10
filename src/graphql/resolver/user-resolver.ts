import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import {GraphQLError} from 'graphql';
import {IContext} from '../../index';
import config from '../../../config';

import User, {IUser, IFriend} from '../../models/user-model';

import {loginRules, signUpRules} from '../../modelRules/user-rules';
import {IFriendRequest} from '../../models/friend-request-model'
import { AuthenticationError } from 'apollo-server-express';
import FriendRequest from '../../models/friend-request-model';
import { string } from 'yup';
import { pubsub } from '../pubsub';
type LoginResponse = {
  token: string | null;
  user: IUser | null;
};


export async function signup(parent: any, args: any): Promise<IUser | Error> {
  try {
    //await signUpRules.validate(args);

    const user = new User({
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: args.email,
      userName: args.userName,
      nickName: null,
      password: args.password,
      birthDate: args.birthDate,
      status: 'Online',
    });
    return await user.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function login(
  parent: any,
  args: any
): Promise<LoginResponse | Error> {
  try {
    //await loginRules.validate(args);

    const userEmail: string = args.email;
    const user: IUser | null = await User.findOne({email: userEmail});

    if (!user) {
      throw new AuthenticationError('User not found!');    }

    const token = jwt.sign({id: user.id, userEmail}, config.jwtSecret!, {
      expiresIn: '1d',
    });

    return {token, user};
  } catch (err) {
    return new GraphQLError(err);
  }
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
    sender: {
      _id:context.user._id,
      email: context.user.email,
      userName: context.user.userName,
      status: 'online'
    },
    receiver: receiver,
    })
    pubsub.publish("newFriendRequest", {newFriendRequest: friendRequest})

    return await friendRequest.save();
}

export async function HandleFriendRequest(
  parent: any,
  args: any,
  context: IContext,
): Promise< IFriendRequest | Error> {

  if (!context.user) throw new AuthenticationError('User not found!');
  if(!args.action) throw new GraphQLError('Action not found!');

  const friendRequest = await FriendRequest.findOne({_id: args.requestId})

  if(!friendRequest) throw new GraphQLError('Friend Request not Found!')

  const sender = await User.findOne({_id: friendRequest.sender._id})
  if(!sender) throw new GraphQLError('The sender of this request was not found!')
  if(args.action === 'accept'){
    //receiver
    const friend1: IFriend = {
      _id: context.user._id,
      email: context.user.email,
      userName: context.user.userName
    }
    //sender
    const friend2: IFriend = {
      _id: sender._id,
      email: sender.email,
      userName: sender.userName
    }
    context.user.friends.push(friend2);
    sender.friends.push(friend1);
    await context.user.save()
    await sender.save()
  }
  friendRequest.deleteOne()
  return friendRequest;

}

