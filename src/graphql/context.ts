import * as express from 'express';
import {validateToken} from '../middlewares/validate-token';
import User from '../models/user-model';
export default async function Context(
  req: express.Request,
  res: express.Response
) {
  const headers = req.headers || '';
  console.log(req);
  if (headers.authorization) {
    const tokenData = validateToken(headers.authorization);
    const user = await User.findOne({_id: tokenData.id});

    console.log(user);
  }

  //   const user = await User.findOne({_id: tokenData.id});

  //   console.log(user);
  //   // add the user to the context
  //   return {user};
}
