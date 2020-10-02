import * as jwt from 'jsonwebtoken';
import config from '../../config';

type ValidateRes = {
  id: string;
  username: string;
  iat: number;
  exp: number;
};

export const validateToken = (token: string): ValidateRes => {
  return jwt.verify(token, config.jwtSecret) as ValidateRes;
};
