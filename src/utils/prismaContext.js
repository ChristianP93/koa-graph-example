const prisma = require('./prismaClient');

function createContext(req) {
    return {
        ...req,
        prisma: prisma,
    };
}

module.exports = createContext;
