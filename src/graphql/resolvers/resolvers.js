const dateScalar = require('../../lib/scalarDate');
const userResolve = require('./users');

const resolvers = {
    Date: dateScalar,
    Query: {
        getUsers: userResolve.query.getUsers,
    },
};

module.exports = resolvers;
