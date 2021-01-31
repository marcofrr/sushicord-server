import * as mongoose from 'mongoose';
import config from '../../config';
import {IFriend, IUser, Status} from './user-model'
const Schema = mongoose.Schema;

export interface IFriendRequest extends mongoose.Document{
  _id: string;
  sender: ISender;
  receiver: IReceiver;
}
export interface ISender{
  _id: string;
  email: string;
  userName: string;
  status: Status;

}
export interface IReceiver{
  _id: string;
  email: string;
  userName: string;
}

const SenderSchema = new Schema(
    {
      _id: {type: String, required: true},
      email: {type: String, required: true},
      userName: {type: String, required: true},
      status: {type: Status, required: false},
    },
    {_id:false,timestamps: true}
  );

  const ReceiverSchema = new Schema(
    {
      _id: {type: String, required: true},
      email: {type: String, required: true},
      userName: {type: String, required: true},
    },
    {_id:false,timestamps: true}
  );

const FriendRequestSchema = new Schema(
  {
    _id: {type: String, required: true},
    sender: SenderSchema,
    receiver: ReceiverSchema,
  },
  {_id:false,timestamps: true}
);

export default mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
