import * as express from 'express';
import * as cors from 'cors';
import schema from '../src/graphql/schema';
import config from '../config/';
import {connectDb} from './db';
import {validateToken} from './middlewares/validate-token';
import User, {IUser} from './models/user-model';
import {UserType} from './graphql/type';

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
      if (!user) return context;
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
    onConnect: async (connectionParams: { token: string | undefined; }, webSocket: any) => {
      console.log('connection gained')
      console.log(connectionParams.token)
        const context: IContext = {};
        const {id} = validateToken(connectionParams.token);
        const user = await User.findOne({_id: id});
        if (!user) return context;
        context.user = user;
        return context;

      // throw new Error('Missing auth token!');
    },
    onDisconnect: (webSocket: any, context : IContext) => {
      console.log('connection lost')
    },
  },
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
