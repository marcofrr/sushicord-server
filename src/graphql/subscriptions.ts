import * as graphql from 'graphql';

import User, { IUser } from '../models/user-model';
import Server from '../models/server-model';
import { UserType,ServerType, FriendRequestType, PrivMessageType} from './type';

import {validateToken} from '../middlewares/validate-token';
import { extendSchemaImpl } from 'graphql/utilities/extendSchema';
import { AuthenticationError, withFilter } from 'apollo-server-express';
import { IContext } from '../index'

import {pubsub} from './pubsub'
import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { pullAll } from 'lodash';

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
                (payload, variables,context : IContext) => {

                return payload.newFriendRequest.receiver._id === variables.receiverId;
                },
              ),
            },
            newPrivMessage: {
                type: PrivMessageType,
                args: {        
                    receiverId: {type: new GraphQLNonNull(GraphQLString)},
                },
                subscribe: withFilter(
                    () => pubsub.asyncIterator('newPrivMessage'),
                    async (payload, variables,context: IContext) => {
                        return payload.newPrivMessage.receiverId === variables.receiverId;
                    },
                  ),
                }
        },
    });
  
