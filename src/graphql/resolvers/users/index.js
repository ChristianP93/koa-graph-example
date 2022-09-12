const getUsers = async (root, { skip = 0, limit = 5 }, ctx) => {
    try {
        const users = await ctx.prisma.user.findMany({ skip, take: limit });
        return users;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = {
    query: {
        getUsers,
    },
    mutations: {},
};
