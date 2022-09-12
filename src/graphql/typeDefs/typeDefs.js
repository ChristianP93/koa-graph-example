const { gql } = require('apollo-server-koa');

/**
 *
  type Mutation {}
 */
const typeDefs = gql`
    scalar Date

    type Query {
        getUsers(skip: Int, limit: Int): [User]
    }

    type User {
        id: ID!
        username: String
        password: String
        createdAt: Date
        updatedAt: Date
    }
`;

module.exports = typeDefs;
