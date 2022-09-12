const prisma = require('../../utils/prismaClient');

const addPrismaToKoaContext = (ctx, next) => {
    ctx.prisma = prisma;
    return next()
};

module.exports = addPrismaToKoaContext;
