import * as express from 'express';
import * as cors from 'cors';
import schema from '../src/graphql/schema';
import config from '../config/';
import {connectDb} from './db';
import {validateToken} from './middlewares/validate-token';
import User, {IUser, STATUS} from './models/user-model';
import {UserType} from './graphql/type';
import { AuthenticationError } from 'apollo-server-express';
import Server from './models/server-model';
import FriendRequest from './models/friend-request-model';
import { pubsub } from './graphql/pubsub';

const {ApolloServer} = require('apollo-server-express');
const http= require('http')
const app = express();
connectDb();

app.use(cors());

export interface IContext  {
  user?: IUser;
};




const server = new ApolloServer({
  schema,
  context: async ({req, connection}: any) => {
    if(connection){
      const context: IContext = {};
      const {id} = validateToken(connection.variables.token);
      const user = await User.findOne({_id: id});
      if (!user) throw new AuthenticationError('User not found!!');
      context.user = user;
      return context;
    }else{
      const context: IContext = {};
      const {id} = validateToken(req.headers.authorization);
      const user = await User.findOne({_id: id});
      if (!user) return context;
      context.user = user;
      return context;
    }

  },
  subscriptions: {
    onConnect: async (connectionParams : any, webSocket : any, context : any, c : IContext) => {
      const {id} = validateToken(connectionParams.token);
      const user = await User.findOne({_id: id});
      if (user){
        user.status = STATUS.ON;
        await user.save()
        const servers = await Server.find({users : {$elemMatch : {_id: user._id}}})
        const pendingRequests = await FriendRequest.find({'sender._id' : id});
        const friends = user.friends;
  
        pubsub.publish("userStatusServer", {
          userStatusServer: {
            user:user,
            servers: servers
        }})
      }

      //gather all the diferent payloads
      // publish them

      // pubsub.publish("newMessageNotification", {
      //   newMessageNotification: {
      //     message:newMessage,
      //     sender: context.user
      //   }})

      return user
    },
    onDisconnect: async (webSocket : any, context : any) => {
      const initialContext = await context.initPromise;
      // const user = await User.findOne({_id: initialContext._id});
      const user = initialContext.user
      if (user){
        user.status = STATUS.OFF;
        await user.save()
      }

      //change status in DB
      //gather all the diferent payloads
      // publish them

    },
  }
});
server.applyMiddleware({app});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({port: config.serverPort}, () =>
  console.log(
    `🤖🚀🤖 Server ready at http://localhost:${config.serverPort}${server.graphqlPath}`
  )
);

export default app;
