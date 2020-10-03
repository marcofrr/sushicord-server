import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface IServerChannel extends mongoose.Document {
  name: string;
  server: string;
}

const ServerChannelSchema = new Schema(
  {
    name: {type: String, required: true},
  },
  {timestamps: true}
);

export default mongoose.model<IServerChannel>(
  'ServerChannel1',
  ServerChannelSchema
);
