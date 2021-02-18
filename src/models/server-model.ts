import * as mongoose from 'mongoose';
import {IUser} from './user-model';

const Schema = mongoose.Schema;

export interface IServer extends mongoose.Document {
  _id: string;
  name: string;
  owner: string;
  voiceChannels: [IVoiceChannel];
  textChannels: [ITextChannel];
  users: [IUser];
}

export interface IVoiceChannel extends mongoose.Document {
  _id: string;
  serverId: string;
  name: string;
  users: [IUser];
}

export interface IServerMessage {
  _id: string;
  serverId: string;
  channelId: string;
  user: IUser;
  content: string;
}

export interface ITextChannel  {
  _id: string;
  serverId: string;
  name: string;
  messages: [IServerMessage];
}

const UsersSchema = new Schema({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  userName: {type: String, required: true},
  nickName: {type: String, required: false},
  birthDate: {type: String, required: true},
  status: {type: String, required: false},
});

const MessageSchema = new Schema({
  _id: {type: String, required: true},
  serverId: {type: String, required: true},
  channelId: {type: String, required: true},
  user: UsersSchema,
  content: {type: String, required: true},
});

const VoiceChannelSchema = new Schema({
  _id: {type: String, required: true},
  serverId: {type: String, required: true},
  name: {type: String, required: true},
  users: [UsersSchema],
});

const TextChannelSchema = new Schema({
  _id: {type: String, required: true},
  serverId: {type: String, required: true},
  name: {type: String, required: true},
  messages: [MessageSchema],
});

const ServerSchema = new Schema(
  {
    _id: {type: String, required: true},
    name: {type: String, required: true},
    owner: {type: String, required: true},
    users: [UsersSchema],
    voiceChannels: [VoiceChannelSchema],
    textChannels: [TextChannelSchema],
  },
  {_id:false,timestamps: true}
);

export default mongoose.model<IServer>('Server', ServerSchema);
