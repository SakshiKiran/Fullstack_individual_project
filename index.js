// const { createServer } = require('http');
// const { ApolloServerPluginDrainHttpServer } =require('@apollo/server/plugin/drainHttpServer');
// const { makeExecutableSchema } =require('@graphql-tools/schema');
// const { WebSocketServer } =require('ws');
// const { useServer } =require('graphql-ws/lib/use/ws');

const { ApolloServer } =  require('apollo-server');
const { PubSub } = require('graphql-subscriptions');


const mongoose = require('mongoose'); 

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { MONGODB } = require('./config.js');

const pubsub = new PubSub();

const PORT = process.env.port || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch(err => {
    console.error(err)
  })