import * as mongoose from 'mongoose';
import {IUser} from './user-model';

const Schema = mongoose.Schema;

export interface IMessage extends mongoose.Document {
    _id: string;
    serverId: string;
    voiceChannelId: string;
    content: string;
    user: [IUser];

}
  

const UserSchema = new Schema({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  userName: {type: String, required: true},
  nickName: {type: String, required: false},
});

const ServerSchema = new Schema(
  {
    _id: {type: String, required: true},
    serverId: {type: String, required: true},
    voiceChannelId: {type: String, required: true},
    content: {type: String, required: true},    
    user: [UserSchema],
  },
  {_id:false,timestamps: true}
);

export default mongoose.model<IMessage>('ServerMessage', ServerSchema);
