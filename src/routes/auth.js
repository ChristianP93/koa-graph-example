const Router = require('koa-router');
const authController = require('../api/auth');
const checkAuthBody = require('../middleware/auth/validateAuthBody');

const router = new Router();

router.post('/register', checkAuthBody, authController.register);
router.post('/login', checkAuthBody, authController.login);

module.exports = router;
