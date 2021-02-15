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
    id: {type: new GraphQLNonNull(GraphQLID)},
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
    user: {type: new GraphQLNonNull(UserType)},
    unreadMessages: {type: GraphQLInt},
  }),
});



export const TokenType = new GraphQLObjectType({
  name: 'Token',
  fields: () => ({
    token: {type: GraphQLString},
    user: {type: UserType},
  }),
});

// export const ChannelType = new GraphQLObjectType({
//   name: 'Channel',
//   fields: () => ({
//     name: {type: GraphQLString},
//     server: {type: UserType},
//   }),
// });

export const serverMessageType = new GraphQLObjectType({
  name: 'ServerMessage',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    serverId: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    user: {type: new GraphQLNonNull(UserType)},
    content: {type: new GraphQLNonNull(GraphQLString)},

  }),
});

export const textChannelType = new GraphQLObjectType({
  name: 'TextChannel',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    serverId: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    users: {type: new GraphQLList(UserType)},
    messages: {type: new GraphQLList(serverMessageType)},
  }),
});

export const voiceChannelType = new GraphQLObjectType({
  name: 'VoiceChannel',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    serverId: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    users: {type: new GraphQLList(UserType)},
  }),
});


export const ServerType = new GraphQLObjectType({
  name: 'Server',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    name: {type: new GraphQLNonNull(GraphQLString)},
    owner: {type: UserType},
    users: {type: new GraphQLList(UserType)},
    voiceChannels: {type: new GraphQLList(voiceChannelType)},
    textChannels: {type: new GraphQLList(textChannelType)},
  }),
});




export const ServerInviteType = new GraphQLObjectType({
  name: 'ServerInvite',
  fields: () => ({
    id: {type: new GraphQLNonNull(GraphQLID)},
    server: {type: new GraphQLNonNull(GraphQLString)},
  }),
});

export const JoinServerType = new GraphQLObjectType({
  name: 'JoinServer',
  fields: () => ({
    serverId: {type: new GraphQLNonNull(GraphQLString)},
  }),

});

export const ServerMessageType = new GraphQLObjectType({
  name: 'ServerMessage',
  fields: () => ({
    serverId: {type: new GraphQLNonNull(GraphQLString)},
    channelId: {type: new GraphQLNonNull(GraphQLString)},
    content: {type: new GraphQLNonNull(GraphQLString)},
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
    sender: {type: new GraphQLNonNull(SenderType)},
    receiver: {type: new GraphQLNonNull(ReceiverType)},
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



// export const HandleRequestType = new GraphQLObjectType({
//   name: 'HandleFriendRequest',
//   fields: () => ({
//     _id: {type: new GraphQLNonNull(GraphQLString)},
//   }),

// });