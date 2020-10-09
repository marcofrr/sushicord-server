import * as express from 'express';
import * as cors from 'cors';
import schema from '../src/graphql/schema';
import config from '../config/';
import {connectDb} from './db';
import {validateToken} from './middlewares/validate-token';
import User, {IUser} from './models/user-model';
import {UserType} from './graphql/type';

const {ApolloServer} = require('apollo-server-express');

const app = express();
connectDb();

app.use(cors());

export interface IContext  {
  user?: IUser;
};

const server = new ApolloServer({
  schema,
  context: async ({req}: any) => {
    const context: IContext = {};
    const {id} = validateToken(req.headers.authorization);
    const user = await User.findOne({_id: id});
    if (!user) return context;
    context.user = user;
    return context;
  },
});
server.applyMiddleware({app});

app.listen({port: config.serverPort}, () =>
  console.log(
    `🤖🚀🤖 Server ready at http://localhost:${config.serverPort}${server.graphqlPath}`
  )
);

export default app;
