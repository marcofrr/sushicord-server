import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import {GraphQLError} from 'graphql';
import config from '../../../config';
import * as mongoose from 'mongoose';
import User, {IUser} from '../../models/user-model';
import {IContext} from '../../index';
import Channel, {IServerChannel} from '../../models/server-channel-model';
import Server, {IServer} from '../../models/server-model';
import Invite from '../../models/server-invite-model';
import {loginRules, signUpRules} from '../../modelRules/user-rules';
import ServerInvite from '../../models/server-invite-model';
import {validateToken} from '../../middlewares/validate-token';
import {createServerRules} from '../../modelRules/server-rules';

import serverInviteModel, {
  IServerInvite,
} from '../../models/server-invite-model';
import {AuthenticationError} from 'apollo-server-express';

export async function createServer(
  parent: any,
  args: any,
  context: IContext,
): Promise<IServer | Error> {
  try {
    //falta realizar a verificacao
    console.log(context.user)
    if (!context.user) throw new AuthenticationError('User not found!');
    const server = new Server({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: args.name,
      owner: context.user._id,
      users: context.user,
    });
    return await server.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function createChannel(
  parent: any,
  args: any,
  context: IContext
): Promise<IServerChannel | Error> {
  //falta realizar a verificacao
  try {
    if (!context.user) throw new AuthenticationError('User not found!');
    const channel = new Channel({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: args.name,
    });
    return await channel.save();
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
