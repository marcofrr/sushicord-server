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
      users: context.user,
      voiceChannels:{
        _id: new mongoose.Types.ObjectId().toHexString(),
        serverId: serverId,
        name: 'Default Voice Channel',
      },
      textChannels: {
        _id: new mongoose.Types.ObjectId().toHexString(),
        serverId: serverId,
        name: 'Default Text Channel',
        messages: {
          _id: new mongoose.Types.ObjectId().toHexString(),
          serverId: serverId,
          user: context.user,
          content: 'Mensagem de Exemplo!!',
        },

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

    const isMember = server.users.find(x => x._id === context.user?._id);
    if (!isMember) throw new AuthenticationError('User not found!');    
    const channel = server.textChannels.find(x => x._id === args.channelId);
    if(!channel)return new GraphQLError('Channel not found!');

    const newMessage : IServerMessage = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      serverId: server._id,
      user: context.user,
      content: args.content,
    }
    channel.messages.push(newMessage);
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




    const isMember = server.users.find(x => x._id === context.user?._id);
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
    const isMember = server.users.find(x => x._id === context.user?._id);
    if (!isMember) throw new AuthenticationError('User already joined!');

    server.users.push(context.user);

    return await server.save();
  } catch (err) {
    return new GraphQLError(err);
  }



}
