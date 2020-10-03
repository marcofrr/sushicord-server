import * as mongoose from 'mongoose';
import {IServerChannel} from './server-channel-model';

const Schema = mongoose.Schema;

export interface IServer extends mongoose.Document {
  name: string;
  owner: string;
  Channels: [IServerChannel];
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
