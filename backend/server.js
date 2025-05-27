require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const connectDB = require('./config/db');
const typeDefs = require('./schemas/schema');
const resolvers = require('./resolvers/taskResolvers');

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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});