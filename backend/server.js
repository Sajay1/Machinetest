require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server');
const connectDB = require('./config/db');
const resolvers = require('./resolvers/taskResolvers');

// ✅ Read schema.graphql as string and wrap with gql
const typeDefs = gql(
  fs.readFileSync(path.join(__dirname, 'schemas', 'schema.graphql'), 'utf8')
);

connectDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error(error);
    return {
      message: error.message,
    };
  },
});

const PORT = process.env.PORT || 4000;

server.listen(PORT).then(({ url }) => {
  console.log(`Server running at ${url}`);
});
