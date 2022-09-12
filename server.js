const config = require('config');
const Koa = require('koa');
const helmet = require('koa-helmet');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const { ApolloServer } = require('apollo-server-koa');

const corsConfig = require('./src/utils/corsConfig');
const publicUrlApi = require('./src/utils/publicUrlApi');
const addPrismaToKoaContext = require('./src/middleware/global/addPrismaToKoaContext');
const graphQlOptions = require('./src/graphql');
const routes = require('./src/routes');

const app = new Koa();
const PORT = config.get('server.port') || 3000;

app.proxy = true;

const secret = config.get('secret');
app.use(jwt({ secret }).unless({ path: publicUrlApi }));

app.use(
    helmet({
        contentSecurityPolicy:
            process.env.NODE_ENV === 'production' ? undefined : false,
    }),
);

app.use(cors(corsConfig));
app.use(bodyParser({ enableTypes: ['json'] }));
app.use(addPrismaToKoaContext)
app.use(routes.routes());
app.use(routes.allowedMethods());

const server = new ApolloServer(graphQlOptions);
server.start().then(() => {
    server.applyMiddleware({ app });
    app.listen(PORT, () => console.log(`listening at port ${PORT}`));
});

module.exports = { server, app };
