import * as graphql from 'graphql';

import User, { IUser } from '../models/user-model';
import Server from '../models/server-model';
import { UserType,ServerType, FriendRequestType, PrivMessageType, ServerMessageType, TextChannelType, NewMessageNotificationType, userStatusServerType, ServerMessageSubType, FriendRequestUserType} from './type';

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
            type: FriendRequestUserType,
            args: {        
                receiverId: {type: new GraphQLNonNull(GraphQLString)},
            },
            subscribe: withFilter(
                () => pubsub.asyncIterator('newFriendRequest'),
                (payload, variables,context : IContext) => {
                return payload.newFriendRequest.friendRequest.receiverId === variables.receiverId;
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
                type: ServerMessageSubType,
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
            },
            newMessageNotification: {
                type: NewMessageNotificationType,
                args: {        
                    receiverId: {type: new GraphQLNonNull(GraphQLString)},
                },
                subscribe: withFilter(
                    () => pubsub.asyncIterator('newMessageNotification'),
                    async (payload, variables,context: IContext) => {
                        return true
                    },
                  ),
            },
            userStatusServer: {
                type: userStatusServerType,
                args: {        
                    serverId: {type: new GraphQLNonNull(GraphQLString)},
                },
                subscribe: withFilter(
                    () => pubsub.asyncIterator('userStatusServer'),
                    async (payload, variables,context: IContext) => {
                        //payload with all serverIDs of the user and the user
                        //send payload if variable matches one of the list
                        return payload.newTextChannel.serverId === variables.serverId;

                    },
                  ),  
            },
            userStatus: {
                type: UserType,
                args: {        
                    userId: {type: new GraphQLNonNull(GraphQLString)},
                },
                subscribe: withFilter(
                    () => pubsub.asyncIterator('userStatus'),
                    async (payload, variables,context: IContext) => {
                        //payload with all friends and pending friend requests and the user
                        //send payload if variable matches one of the list
                        return payload.newTextChannel.serverId === variables.serverId;

                    },
                  ),  
            }
        },
    });
  
