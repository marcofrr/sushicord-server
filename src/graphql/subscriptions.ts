import * as graphql from 'graphql';

import User, { IUser } from '../models/user-model';
import Server from '../models/server-model';
import { UserType,ServerType, FriendRequestType, PrivMessageType, ServerMessageType, TextChannelType} from './type';

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
                        if(payload.newPrivMessage.receiverId === variables.receiverId) return true;
                        if(payload.newPrivMessage.senderId === variables.receiverId) return true;

                        return false

                    },
                  ),
            },
            newChannelMessage: {
                type: ServerMessageType,
                args: {        
                    channelId: {type: new GraphQLNonNull(GraphQLString)},
                },
                subscribe: withFilter(
                    () => pubsub.asyncIterator('newChannelMessage'),
                    async (payload, variables,context: IContext) => {

                        return payload.newChannelMessage.channelId === variables.channelId;

                    },
                  ),
            },
            newTextChannel: {
                type: TextChannelType,
                args: {        
                    serverId: {type: new GraphQLNonNull(GraphQLString)},
                },
                subscribe: withFilter(
                    () => pubsub.asyncIterator('newTextChannel'),
                    async (payload, variables,context: IContext) => {

                        return payload.newTextChannel.serverId === variables.serverId;

                    },
                  ),
            }
        },
    });
  
