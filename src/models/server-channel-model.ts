import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IServerChannel extends mongoose.Document {
  _id: string;
  name: string;
  server: string;
}

const ServerChannelSchema = new Schema(
  {
    _id: {type: String, required: true},
    name: {type: String, required: true},
  },
  {_id:false,timestamps: true}
);

export default mongoose.model<IServerChannel>(
  'ServerChannel1',
  ServerChannelSchema
);
