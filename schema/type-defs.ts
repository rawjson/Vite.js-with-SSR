const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: Number!
    name: String!
    firstname: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Query {
    users: [User!]!
  }
`;
