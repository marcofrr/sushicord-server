import * as mongoose from 'mongoose';
import {IUser} from './user-model';

const Schema = mongoose.Schema;

export interface IPrivMessage extends mongoose.Document {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    isSeen: boolean;
    createdAt: string;
}
  

const PrivateMessageSchema = new Schema(
  {
    _id: {type: String, required: true},
    senderId: {type: String, required: true},
    receiverId: {type: String, required: true},
    content: {type: String, required: true},
    isSeen: {type: Boolean, required: true, default:false},

  },
  {_id:false,timestamps: true}
);

export default mongoose.model<IPrivMessage>('PrivateMessage', PrivateMessageSchema);
