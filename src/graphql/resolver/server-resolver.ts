import * as _ from 'lodash';
import {GraphQLError} from 'graphql';
import * as mongoose from 'mongoose';
import {IContext} from '../../index';
import Server, {IServer, IServerMessage, ITextChannel} from '../../models/server-model';
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
import { pubsub } from '../pubsub';
import { userStatusServerType } from '../type';

export async function createServer(
  parent: any,
  args: any,
  context: IContext,
): Promise<IServer | Error> {
  try {
    //falta realizar a verificacao
    if (!context.user) throw new AuthenticationError('User not found!');
    const serverId = new mongoose.Types.ObjectId().toHexString();
    const server = new Server({
      _id: serverId,
      name: args.name,
      owner: context.user._id,
      users: context.user._id,
      voiceChannels:{
        _id: new mongoose.Types.ObjectId().toHexString(),
        serverId: serverId,
        name: 'Default Voice Channel',
      },
      textChannels: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        serverId: serverId,
        name: 'Default Text Channel',
      },
    });
    return await server.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}


export async function createMessage(
  parent: any,
  args: any,
  context: IContext
): Promise<IServer | Error> {

  try {
    //falta realizar a verificacao    
    if (!context.user) throw new AuthenticationError('User not found!');
    const server = await Server.findOne({_id: args.serverId});
    if (!server) return new GraphQLError('Server not found!');

    const isMember = server.users.find(x => x === context.user?._id);
    if (!isMember) throw new AuthenticationError('User not found!');    
    const channel = server.textChannels.find(x => x._id === args.channelId);
    if(!channel)return new GraphQLError('Channel not found!');

    const newMessage : IServerMessage = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      serverId: server._id,
      channelId: channel._id,
      userId: context.user._id,
      content: args.content,
      createdAt: Date.now().toString()
    }
    channel.messages?.push(newMessage);
    const user = context.user
    pubsub.publish("newChannelMessage", {newChannelMessage:{
      message: {newMessage},
      user: {user}
    }})      

    return await server.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function createTextChannel(
  parent: any,
  args: any,
  context: IContext
): Promise<IServer | Error> {

  try {
    if (!context.user) throw new AuthenticationError('User not found!');
    const server = await Server.findOne({_id: args.serverId});
    if (!server) return new GraphQLError('Server not found!');
    if(context.user._id != server.owner) return new GraphQLError('Must be owner to create a channel!');
    
    const newChannel : ITextChannel = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      serverId: server._id,
      name: args.channelName,

    }

    server.textChannels.push(newChannel)
    pubsub.publish("newTextChannel", {newTextChannel: newChannel})      

    return await server.save();
  
  } catch (err) {
    return new GraphQLError(err);
  }
}


export async function createInvite(
  parent: any,
  args: any,
  context: IContext,
): Promise<IServerInvite | Error> {
  try {
    if (!context.user) throw new AuthenticationError('User not found!');

    const server = await Server.findOne({_id: args.serverId});
    if (!server) return new GraphQLError('Server not found!');

    const isMember = server.users.find(x => x === context.user?._id);
    if (!isMember) throw new AuthenticationError('User not found!');

    const invite = new serverInviteModel({
      _id: new mongoose.Types.ObjectId().toHexString(),
      serverId: args.serverId,
    });

    return await invite.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function joinServer(
  parent: any,
  args: any,
  context: any
): Promise<IServer | Error> {
  try {
    if (!context.user) throw new AuthenticationError('User not found!');
    const invite = await Invite.findOne({_id: args.invite});
    if (!invite) return new GraphQLError('Invite does not exist!');
    const server = await Server.findOne({_id: invite.serverId});
    if (!server) return new GraphQLError('Cannot find server!');
    const isMember = server.users.find(x => x === context.user?._id);
    if (!isMember) throw new AuthenticationError('User already joined!');

    server.users.push(context.user._id);

    return await server.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}


//leave server
