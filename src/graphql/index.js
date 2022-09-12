const resolvers = require('./resolvers/resolvers');
const typeDefs = require('./typeDefs/typeDefs');
const createContext = require('../utils/prismaContext');

const graphOptions = {
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    path: '/graphql',
    context: createContext,
};

module.exports = graphOptions;
