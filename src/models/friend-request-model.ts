import * as mongoose from 'mongoose';
import config from '../../config';
import {IFriend, IUser, STATUS} from './user-model'
const Schema = mongoose.Schema;

export interface IFriendRequest extends mongoose.Document{
  _id: string;
  senderId: string;
  receiverId: string;
}


const FriendRequestSchema = new Schema(
  {
    _id: {type: String, required: true},
    senderId: {type: String, required: true},
    receiverId: {type: String, required: true},
  },
  {_id:false,timestamps: false}
);

export default mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
