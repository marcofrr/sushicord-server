import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';

import {GraphQLError} from 'graphql';
import config from '../../../config';

import User, {IUser} from '../../models/user-model';
import Channel, {IServerChannel} from '../../models/server-channel-model';
import Server, {IServer} from '../../models/server-model';
import {loginRules, signUpRules} from '../../modelRules/user-rules';

import {validateToken} from '../../middlewares/validate-token';
import {createServerRules} from '../../modelRules/server-rules';
import serverInviteModel, {
  IServerInvite,
} from '../../models/server-invite-model';

export async function createServer(
  parent: any,
  args: any,
  {headers}: any
): Promise<IServer | Error> {
  try {
    await createServerRules.validate(args);
    if (!headers.authorization) return new GraphQLError('Token not valid!');
    const tokenData = validateToken(headers.authorization);
    const user = await User.findOne({_id: tokenData.id});
    if (!user) return new GraphQLError('User not found');
    const server = new Server({
      name: args.name,
      owner: user._id,
      users: user._id,
    });
    return await server.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function createChannel(
  parent: any,
  args: any,
  {headers}: any
): Promise<IServerChannel | Error> {
  try {
    if (!headers.authorization) return new GraphQLError('Token not valid!');
    const tokenData = validateToken(headers.authorization);
    const user = User.findById(tokenData.id);
    if (!user) return new GraphQLError('User not found');
    const channel = new Channel({
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
  {headers}: any
): Promise<IServerInvite | Error> {
  try {
    if (!headers.authorization) return new GraphQLError('Token not valid!');
    const tokenData = validateToken(headers.authorization);
    const user = await User.findById(tokenData.id);
    if (!user) return new GraphQLError('User not found');
    const isMember = await Server.findOne({users: user._id});

    if (!isMember) return new GraphQLError('User not found');

    const server = await Server.findOne({_id: args.serverId});
    if (!server) return new GraphQLError('Server not found');
    const invite = new serverInviteModel({
      server: args.serverId,
    });

    return await invite.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}
