import * as mongoose from 'mongoose';
import {IServerChannel} from './server-channel-model';
import { IUser } from './user-model';

const Schema = mongoose.Schema;

export interface IServer extends mongoose.Document {
  name: string;
  owner: string;
  channels: [IServerChannel];
  users: [IUser];
}

const ServerSchema = new Schema(
  {
    name: {type: String, required: true},
    owner: {type: String, required: true},
    users: {type: [String], required: false},
  },
  {timestamps: true}
);

export default mongoose.model<IServer>('Server', ServerSchema);
