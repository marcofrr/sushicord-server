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
  email: string;
  userName: string;
  nickName: string;
  password: string;
  birthDate: string;
  status: Status;
}

const UserSchema = new Schema(
  {
    email: {type: String, required: true},
    userName: {type: String, required: true},
    nickName: {type: String, required: false},
    password: {type: String, required: true},
    birthDate: {type: String, required: true},
    status: {type: Status, required: false},
  },
  {timestamps: true}
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
