import * as graphql from 'graphql';

import User from '../models/user-model';

import {UserType} from './type';

import {validateToken} from '../middlewares/validate-token';

const {GraphQLObjectType, GraphQLID, GraphQLList} = graphql;

export const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      resolve(parent: any, args: any, {headers}: any) {
        const {authorization} = headers;
        const user = validateToken(authorization);

        return User.findById(user.id);
      },
    },
  },
});
