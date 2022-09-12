const checkAuthBody = async (ctx, next) => {
    const { body } = ctx.request;
    try {
        if (!body.username || !body.password) {
            ctx.status = 400;
            ctx.body = {
                error: `expected an object with username, password but got: ${body}`,
            };
            return {body: ctx.body, status: ctx.status};
        }
        return next();
    } catch (error) {
        return error;
    }
};

module.exports = checkAuthBody;
