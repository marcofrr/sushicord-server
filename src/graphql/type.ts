import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    userName: {type: new GraphQLNonNull(GraphQLString)},
    nickName: {type: GraphQLString},
    password: {type: new GraphQLNonNull(GraphQLString)},
    birthDate: {type: new GraphQLNonNull(GraphQLString)},
    status: {type: GraphQLString},
  }),
});

export const UserNotificationType = new GraphQLObjectType({
  name: 'UserNotification',
  fields: () => ({
    userId: {type: new GraphQLNonNull(GraphQLString)},
    userName: {type: new GraphQLNonNull(GraphQLString)},
    status: {type: new GraphQLNonNull(GraphQLString)},
    unreadMessages: {type: new GraphQLNonNull(GraphQLInt)},
  }),
});

export const NewMessageNotificationType = new GraphQLObjectType({
  name: 'NewMessageNotification',
  fields: () => ({
    message: {type: PrivMessageType},
    sender: {type: UserType},
  }),
});

export const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: {type: GraphQLString},
    user: {type: UserType},
  }),
});

export const ChannelType = new GraphQLObjectType({
  name: 'Channel',
  fields: () => ({
    name: {type: GraphQLString},
    server: {type: UserType},
  }),
});

export const ServerMessageType = new GraphQLObjectType({
  name: 'ServerMessage',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    serverId: {type: new GraphQLNonNull(GraphQLID)},
    channelId: {type: new GraphQLNonNull(GraphQLString)},
    userId: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
    createdAt: {type: new GraphQLNonNull(GraphQLString)},
  }),
});



export const TextChannelType = new GraphQLObjectType({
  name: 'TextChannel',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    serverId: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    users: {type: new GraphQLList(UserType)},
    messages: {type: new GraphQLList(ServerMessageType)},
  }),
});

export const VoiceChannelType = new GraphQLObjectType({
  name: 'VoiceChannel',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    serverId: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    users: {type: new GraphQLList(UserType)},
  }),
});


export const ServerType = new GraphQLObjectType({
  name: 'Server',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    shortId:{type: new GraphQLNonNull(GraphQLString)},
    owner: {type: UserType},
    users: {type: new GraphQLList(UserType)},
    voiceChannels: {type: new GraphQLList(VoiceChannelType)},
    textChannels: {type: new GraphQLList(TextChannelType)},
  }),
});




export const ServerInviteType = new GraphQLObjectType({
  name: 'ServerInvite',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLID)},
    server: {type: new GraphQLNonNull(GraphQLString)},
  }),
});

export const JoinServerType = new GraphQLObjectType({
  name: 'JoinServer',
  fields: () => ({
    serverId: {type: new GraphQLNonNull(GraphQLString)},
  }),

});

export const SenderType = new GraphQLObjectType({
  name: 'Sender',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    userName: {type: new GraphQLNonNull(GraphQLString)},
    status: {type: new GraphQLNonNull(GraphQLString)},
  }),

});

export const ReceiverType = new GraphQLObjectType({
  name: 'Receiver',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLString)},
    email: {type: new GraphQLNonNull(GraphQLString)},
    userName: {type: new GraphQLNonNull(GraphQLString)},
  }),

});
export const FriendRequestType = new GraphQLObjectType({
  name: 'FriendRequest',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLString)},
    senderId: {type: new GraphQLNonNull(GraphQLString)},
    receiverId: {type: new GraphQLNonNull(GraphQLString)},
  }),
});


export const FriendRequestUserType = new GraphQLObjectType({
  name: 'FriendRequestUser',
  fields: () => ({
    friendRequest: {type: new GraphQLNonNull(FriendRequestType)},
    sender: {type: new GraphQLNonNull(UserType)},
  }),
});

export const ServerMessageUserType = new GraphQLObjectType({
  name: 'ServerMessageUser',
  fields: () => ({
    message: {type: new GraphQLNonNull(ServerMessageType)},
    user: {type: new GraphQLNonNull(UserType)},
  }),
});

export const PrivMessageType = new GraphQLObjectType({
  name: 'PrivMessage',
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLString)},
    senderId: {type: new GraphQLNonNull(GraphQLString)},
    receiverId: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
    isSeen: {type: new GraphQLNonNull(GraphQLBoolean)},
    createdAt: {type: new GraphQLNonNull(GraphQLString)},

  }),
});

export const userStatusServerType = new GraphQLObjectType({
  name: 'userStatusServer',
  fields: () => ({
    user: {type: new GraphQLNonNull(UserType)},
    servers: {type: new GraphQLList(ServerType)},
  }),
});

export const userStatusType = new GraphQLObjectType({
  name: 'userStatus',
  fields: () => ({
    user: {type: new GraphQLNonNull(UserType)},
    servers: {type: new GraphQLList(ServerType)},
    friends: {type: new GraphQLList(GraphQLString)},
  }),
});
