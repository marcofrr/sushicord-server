import * as express from 'express';
import * as cors from 'cors';
import schema from '../src/graphql/schema';
import config from '../config/';

import {connectDb} from './db';

const {ApolloServer} = require('apollo-server-express');

const app = express();
connectDb();

app.use(cors());

const server = new ApolloServer({schema});
server.applyMiddleware({app});

app.listen({port: config.serverPort}, () =>
  console.log(
    `🤖🚀🤖 Server ready at http://localhost:${config.serverPort}${server.graphqlPath}`
  )
);

export default app;
