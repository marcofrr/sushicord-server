import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

export enum Status {
  ON = 'Online',
  OFF = 'Offline',
  DND = 'Do Not Disturb',
  INVI = 'Invisible',
}

export interface IUser extends mongoose.Document {
  _id: string;
  email: string;
  userName: string;
  nickName: string;
  password: string;
  birthDate: string;
  status: Status;
  friends: [IFriend];
}

export interface IFriend  {
  _id: string;
  email: string;
  userName: string;
}

const FriendSchema = new Schema(
  {
    _id: {type: String, required: true},
    email: {type: String, required: true},
    userName: {type: String, required: true},
    status: {type: Status, required: false},
  },
  {_id:false,timestamps: true}
);

const UserSchema = new Schema(
  {
    _id: {type: String, required: true},
    email: {type: String, required: true},
    userName: {type: String, required: true},
    nickName: {type: String, required: false},
    password: {type: String, required: true},
    birthDate: {type: String, required: true},
    status: {type: Status, required: false},
    friends: [FriendSchema]
  },
  {_id:false,timestamps: true}
);

UserSchema.pre('save', function (next: mongoose.HookNextFunction): void {
  const user: any = this;

  if (!user.password || !user.email || !user.userName || !user.birthDate)
    next();

  bcrypt.genSalt(10, function (err: any, salt: string): void {
    if (err) {
      throw new Error(err);
    } else {
      bcrypt.hash(user.password, salt, function (err: any, hashed: string) {
        if (err) return next(err);

        user.password = hashed;
        next();
      });
    }
  });
});

export default mongoose.model<IUser>('User', UserSchema);
