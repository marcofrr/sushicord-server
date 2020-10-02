import * as express from 'express';
import * as cors from 'cors';
const {graphqlHTTP} = require('express-graphql');
import schema from '../src/graphql/schema';
import config from '../config/';
const expressPlayground = require('graphql-playground-middleware-express')
  .default;
import {connectDb} from './db';
const app = express();

connectDb();

app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.get('/playground', expressPlayground({endpoint: '/graphql'}));

app.listen(config.serverPort, () => {
  console.log(`now listening for requests on port ${config.serverPort}`);
});

export default app;
