const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

const PORT = process.env.PORT || 9090;

const dbLocal = process.env.DATABASE_LOCAL;

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(db, {
  .connect(dbLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    // console.log(`Connected to MongoDB → ${db}`);
    console.log(`Connected to MongoDB → ${dbLocal}`);
    return server.listen({ port: PORT });
  })
  .then(({ url }) => console.log(`Server running at → ${url}`))
  .catch((err) => console.error(`Could not connect to MongoDB → ${err}`));
