const bcrypt = require('bcryptjs');
const config = require('config');
const jsonwebtoken = require('jsonwebtoken');

/**
 * @dev allow registration;
 * @param username: string;
 * @param password: string;
 */
const register = async (ctx) => {
    const { body } = ctx.request;
    try {
        body.username = body.username.toLowerCase();

        const checkUser = await ctx.prisma.user.findUnique({
            where: {
                username: body.username,
            },
        });

        if (!checkUser) {
            const user = {
                username: body.username,
                password: await bcrypt.hash(body.password, 5),
            };

            const newUser = await ctx.prisma.user.create({
                data: user,
            });

            ctx.status = 200;
            ctx.body = {
                message: 'REGISTRATION-SUCCEEDED',
                newUser,
            };
        } else {
            ctx.status = 406;
            ctx.body = {
                message: 'USERNAME-ALREADY-EXISTS',
            };
        }
        return {body: ctx.body, status: ctx.status};

    } catch (error) {
        ctx.throw(500);
    }
};

/**
 * @dev allow login;
 * @param username: string;
 * @param password: string;
 */
const login = async (ctx) => {
    const { body } = ctx.request;
    const secret = config.get('secret');

    body.username = body.username.toLowerCase();

    try {
        const user = await ctx.prisma.user.findUnique({
            where: {
                username: body.username,
            },
        });

        if (!user) {
            ctx.status = 401;
            ctx.body = { message: 'USERNAME-NOT-FOUND' };
            return {body: ctx.body, status: ctx.status};
        }

        if (await bcrypt.compare(body.password, user.password)) {
            ctx.status = 200;
            ctx.body = {
                message: 'LOGIN-SUCCEEDED',
                user: user,
                token: jsonwebtoken.sign(
                    {
                        data: user,
                        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
                    },
                    secret,
                ),
            };
        } else {
            ctx.status = 401;
            ctx.body = { message: 'PASSWORD-ERROR' };
        }
        return {body: ctx.body, status: ctx.status};
    } catch (error) {
        ctx.throw(500);
    }
};

module.exports = {
    register,
    login,
};
