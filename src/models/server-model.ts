import * as mongoose from 'mongoose';
import {IServerChannel} from './server-channel-model';
import {IUser} from './user-model';

const Schema = mongoose.Schema;

export interface IServer extends mongoose.Document {
  _id: string;
  name: string;
  owner: string;
  channels: [IServerChannel];
  users: [IUser];
}

const UsersSchema = new Schema({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  userName: {type: String, required: true},
  nickName: {type: String, required: false},
  birthDate: {type: String, required: true},
  status: {type: String, required: false},
});

const ServerSchema = new Schema(
  {
    _id: {type: String, required: true},
    name: {type: String, required: true},
    owner: {type: String, required: true},
    users: [UsersSchema],
  },
  {_id:false,timestamps: true}
);

export default mongoose.model<IServer>('Server', ServerSchema);
