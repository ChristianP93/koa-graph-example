const Router = require('koa-router');
const authRoutes = require('./auth');

const router = new Router();

router.use('/auth', authRoutes.routes());

module.exports = router;
