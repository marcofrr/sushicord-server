import * as _ from 'lodash';
import {GraphQLError} from 'graphql';
import * as mongoose from 'mongoose';
import {IContext} from '../../index';
import Server, {IServer, IServerMessage} from '../../models/server-model';
import Invite from '../../models/server-invite-model';
import {loginRules, signUpRules} from '../../modelRules/user-rules';
import ServerInvite from '../../models/server-invite-model';
import {validateToken} from '../../middlewares/validate-token';
import {createServerRules} from '../../modelRules/server-rules';

import serverInviteModel, {
  IServerInvite,
} from '../../models/server-invite-model';
import {AuthenticationError} from 'apollo-server-express';
import Context from '../context';
import PrivateMessage,{ IPrivMessage } from '../../models/private-message-model';
import User, { IUser } from '../../models/user-model'
import { pubsub } from '../pubsub';

export async function createPrivMessage(
    parent: any,
    args: any,
    context: IContext
  ): Promise<IPrivMessage | Error> {
  
    try {
      //falta realizar a verificacao    
      if (!context.user) throw new AuthenticationError('User not found!');
      const receiver = await User.findOne({_id: args.receiverId});
      if (!receiver) return new GraphQLError('Receiver was not found!');
      
      const newMessage = new PrivateMessage({
        _id: new mongoose.Types.ObjectId().toHexString(),
        senderId: context.user._id,
        receiverId: args.receiverId,
        content: args.content,
        isSeen: false,
        createdAt: Date.now().toString()
      })
      pubsub.publish("newPrivMessage", {newPrivMessage: newMessage})
      const user = context.user
      pubsub.publish("newMessageNotification", {
        newMessageNotification: {
          message:newMessage,
          sender: context.user
        }})



        
      return await newMessage.save();
    } catch (err) {
      return new GraphQLError(err);
    }
}

export async function getPrivMessage(
  parent: any,
  args: any,
  context: IContext
): Promise<IPrivMessage | Error> {

  try {
    //falta realizar a verificacao    
    if (!context.user) throw new AuthenticationError('User not found!');
    const receiver = await User.findOne({_id: args.receiverId});
    if (!receiver) return new GraphQLError('Receiver was not found!');
  
    const newMessage = new PrivateMessage({
      _id: new mongoose.Types.ObjectId().toHexString(),
      senderId: args.senderId,
      receiverId: args.receiverId,
      content: args.content,
    })
    //fazer o trigger da sub
    return await newMessage.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function toggleUnseenMessages(
  parent: any,
  args: any,
  context: IContext
): Promise<IUser | Error> {

  try {
    //falta realizar a verificacao    
    if (!context.user) throw new AuthenticationError('User not found!');
    const sender = await User.findOne({_id: args.senderId});
    if (!sender) return new GraphQLError('Sender was not found!');
  
    // const messages = PrivateMessage.updateMany({receiverId: context.user.id,senderId: args.senderId}, {isSeen: true})
    const messages = await PrivateMessage.bulkWrite([{
      updateMany: {
        filter: { receiverId: context.user.id, senderId: args.senderId},
        update: { isSeen: true}
      }
    }])
    return sender
  } catch (err) {
    return new GraphQLError(err);
  }
}