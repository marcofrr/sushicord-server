import * as mongoose from 'mongoose';
import {IUser} from './user-model';

const Schema = mongoose.Schema;

export interface IServer extends mongoose.Document {
  _id: string;
  name: string;
  owner: string;
  voiceChannels: [IVoiceChannel];
  textChannels: [ITextChannel];
  users: [string];
}

export interface IVoiceChannel extends mongoose.Document {
  _id: string;
  serverId: string;
  name: string;
  users?: [string];
}

export interface IServerMessage {
  _id: string;
  serverId: string;
  channelId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface ITextChannel  {
  _id: string;
  serverId: string;
  name: string;
  messages?: [IServerMessage];
}



const MessageSchema = new Schema({
  _id: {type: String, required: true},
  serverId: {type: String, required: true},
  channelId: {type: String, required: true},
  userId: {type: String, required: true},
  content: {type: String, required: true},
  createdAt: {type: String, required: true}
});

const VoiceChannelSchema = new Schema({
  _id: {type: String, required: true},
  serverId: {type: String, required: true},
  name: {type: String, required: true},
  users: [String],
});

const TextChannelSchema = new Schema({
  _id: {type: String, required: true},
  serverId: {type: String, required: true},
  name: {type: String, required: true},
  messages: {type: [MessageSchema], required: false},
});

const ServerSchema = new Schema(
  {
    _id: {type: String, required: true},
    name: {type: String, required: true},
    owner: {type: String, required: true},
    users: [String],
    voiceChannels: [VoiceChannelSchema],
    textChannels: [TextChannelSchema],
  },
  {_id:false,timestamps: false}
);

export default mongoose.model<IServer>('Server', ServerSchema);
