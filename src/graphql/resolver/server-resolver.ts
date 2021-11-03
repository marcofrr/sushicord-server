import * as _ from 'lodash';
import {GraphQLError} from 'graphql';
import * as mongoose from 'mongoose';
import {IContext} from '../../index';
import Server, {IServer, IServerMessage, ITextChannel} from '../../models/server-model';
import {loginRules, signUpRules} from '../../modelRules/user-rules';
import {validateToken} from '../../middlewares/validate-token';
import {createServerRules} from '../../modelRules/server-rules';

import {AuthenticationError} from 'apollo-server-express';
import Context from '../context';
import { pubsub } from '../pubsub';
import { userStatusServerType } from '../type';
import User, { IFriend, STATUS } from '../../models/user-model';
import { nanoid } from 'nanoid'

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
      shortId: nanoid(8),
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
        name: 'Canal de Texto',
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

    const message : IServerMessage = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      serverId: server._id,
      channelId: channel._id,
      userId: context.user._id,
      content: args.content,
      createdAt: Date.now().toString()
    }
    channel.messages?.push(message);
    const user = context.user
    pubsub.publish("newChannelMessage", {
      newChannelMessage: {
        message,
        user
      }
    })      
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


// export async function createInvite(
//   parent: any,
//   args: any,
//   context: IContext,
// ): Promise<IServerInvite | Error> {
//   try {
//     if (!context.user) throw new AuthenticationError('User not found!');

//     const server = await Server.findOne({_id: args.serverId});
//     if (!server) return new GraphQLError('Server not found!');

//     const isMember = server.users.find(x => x === context.user?._id);
//     if (!isMember) throw new AuthenticationError('User not found!');

//     const invite = new serverInviteModel({
//       _id: new mongoose.Types.ObjectId().toHexString(),
//       serverId: args.serverId,
//     });

//     return await invite.save();
//   } catch (err) {
//     return new GraphQLError(err);
//   }
// }

export async function joinServer(
  parent: any,
  args: any,
  context: any
): Promise<IServer | Error> {
  try {
    if (!context.user) throw new AuthenticationError('User not found!');
    const server = await Server.findOne({shortId: args.shortId});
    if (!server) return new GraphQLError('Cannot find server!');
    console.log(server.users)
    const isMember = server.users.find(x => x === context.user?._id);
    if (isMember) throw new AuthenticationError('User already joined!');

    server.users.push(context.user._id);
    return await server.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}


export async function getMembers(
  parent: any,
  args: any,
  context: any
): Promise<IUser[] | Error> {
  if(!args.token)throw new AuthenticationError('Token not found!');
  if(!args.serverId)throw new AuthenticationError('Server id not found!');       
  const {id} = validateToken(args.token);
  const user = await User.findOne({_id: id});
  if(!user) throw new AuthenticationError('User not found!');
  const server = await Server.findOne({_id: args.serverId});
  if (!server) return new GraphQLError('Server not found!');
  const isMember = server.users.find(x => x === user._id);
  if(!isMember) throw new AuthenticationError('User must be a member off the server!');
  const list = server.users.map(x => x)
  const members = await User.find({ '_id': { $in: list } });
  return members
}


interface channelMessagesRes {
  message?: IServerMessage;
  user?: IUser;
}
export async function getChannelMessages(
  parent: any,
  args: any,
  context: any
): Promise<channelMessagesRes[] | Error> {
  if(!args.token)throw new AuthenticationError('Token not found!');
  const {id} = validateToken(args.token);
  const user = await User.findOne({_id: id});
  if(!user) throw new AuthenticationError('User not found!');
  
  const channel = await Server.findOne({_id: args.serverId}).select({ textChannels: {$elemMatch: {_id: args.channelId}}});
  let messages = _.sortBy(channel?.textChannels[0].messages,'createdAt').reverse();
  messages =_.slice(messages,args.offset,args.limit + args.offset)
  const res: channelMessagesRes[] = [];
  if(messages.length === 0) return res

  for(const message of messages){
      const user = await User.findOne({_id: message.userId})
      if(!user) throw new GraphQLError('User was not given!');
      const item : channelMessagesRes ={
        message: message,
        user: user
      }
      res.push(item)
  }
  return res
}

//leave server
export async function getServers(
  parent: any,
  args: any,
  context: any
): Promise<IServer[] | Error> {
  if(!args.token)throw new AuthenticationError('Token not found!');
  const {id} = validateToken(args.token);
  const user = await User.findOne({_id: id});
  if(!user) throw new AuthenticationError('User not found!');
  const serverList = await Server.find({users :user._id}).sort({name:'asc'})
  return serverList
}

