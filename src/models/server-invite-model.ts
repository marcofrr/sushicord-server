import * as mongoose from 'mongoose';
import {IServerChannel} from './server-channel-model';
import config from '../../config';
const Schema = mongoose.Schema;

export interface IServerInvite extends mongoose.Document {
  server: string;
}

const ServerSchema = new Schema(
  {
    server: {type: String, required: true},
    expiresAt: {
      type: Date,
      default: Date.now,
      expires: config.inviteDuration,
    },
  },
  {timestamps: false}
);

export default mongoose.model<IServerInvite>('ServerInvite', ServerSchema);
