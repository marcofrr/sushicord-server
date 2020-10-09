import * as mongoose from 'mongoose';
import {IServerChannel} from './server-channel-model';
import config from '../../config';
const Schema = mongoose.Schema;

export interface IServerInvite extends mongoose.Document {
  _id: string;
  serverId: string;
}

const ServerSchema = new Schema(
  {
    _id: {type: String, required: true},
    serverId: {type: String, required: true},
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: config.inviteDuration,
    },
  },
  {_id:false,timestamps: false}
);

export default mongoose.model<IServerInvite>('ServerInvite', ServerSchema);
