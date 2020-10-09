import * as jwt from 'jsonwebtoken';
import config from '../../config';

type ValidateRes = {
  id?: string;
  username?: string;
  iat?: number;
  exp?: number;
};

export const validateToken = (token?: string): ValidateRes => {
  if (token) {
    try {
      return jwt.verify(token, config.jwtSecret) as ValidateRes;
    } catch (err) {
      return {
        id: undefined,
        username: undefined,
        iat: undefined,
        exp: undefined,
      };
    }
  }
  return {id: undefined, username: undefined, iat: undefined, exp: undefined};
  // if (!token) return (undefined as unknown) as ValidateRes;
};
