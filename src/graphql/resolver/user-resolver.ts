import * as _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as mongoose from 'mongoose';
import {GraphQLError} from 'graphql';
import {IContext} from '../../index';
import config from '../../../config';

import User, {IUser, IFriend} from '../../models/user-model';

import {loginRules, signUpRules} from '../../modelRules/user-rules';
import {IFriendRequest} from '../../models/friend-request-model'
import { AuthenticationError } from 'apollo-server-express';
import FriendRequest from '../../models/friend-request-model';
import { string } from 'yup';
import { pubsub } from '../pubsub';
type LoginResponse = {
  token: string | null;
  user: IUser | null;
};


export async function signup(parent: any, args: any): Promise<IUser | Error> {
  try {
    //await signUpRules.validate(args);

    const user = new User({
      _id: new mongoose.Types.ObjectId().toHexString(),
      email: args.email,
      userName: args.userName,
      nickName: null,
      password: args.password,
      birthDate: args.birthDate,
      status: 'online',
    });
    return await user.save();
  } catch (err) {
    return new GraphQLError(err);
  }
}

export async function login(
  parent: any,
  args: any
): Promise<LoginResponse | Error> {
  try {
    //await loginRules.validate(args);

    const userEmail: string = args.email;
    const user: IUser | null = await User.findOne({email: userEmail});

    if (!user) {
      throw new AuthenticationError('User not found!');    }

    const token = jwt.sign({id: user.id, userEmail}, config.jwtSecret!, {
      expiresIn: '1d',
    });

    return {token, user};
  } catch (err) {
    return new GraphQLError(err);
  }
}




