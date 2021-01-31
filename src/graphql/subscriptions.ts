import * as graphql from 'graphql';

import User, { IUser } from '../models/user-model';
import Server from '../models/server-model';
import { UserType,ServerType, FriendRequestType} from './type';

import {validateToken} from '../middlewares/validate-token';
import { extendSchemaImpl } from 'graphql/utilities/extendSchema';
import { AuthenticationError, withFilter } from 'apollo-server-express';
import { IContext } from '../index'

import {pubsub} from './pubsub'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

export const Subscription = new GraphQLObjectType({
    name: 'Subscription',
        fields: {
            newFriendRequest: {
            type: FriendRequestType,
            args: {        
                receiverId: {type: new GraphQLNonNull(GraphQLString)},
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator('newFriendRequest'),
                (payload, variables) => {
                    console.log(payload);
                    console.log(variables);
                    return payload
                //  return payload.commentAdded.repository_name === variables.repoFullName;
                },
              ),
            }
        },
    });
  