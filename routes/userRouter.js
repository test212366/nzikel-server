const Router = require('express'),
	router = new Router(),
	UserController = require('../controllers/userController'),
	{body} = require('express-validator'),
	authMiddleware = require('../middlewares/authMiddleware')
 
router.post('/registration', body('email').isEmail(),
	body('password').isLength({min: 3, max: 32}), UserController.register)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)
router.get('/users', authMiddleware, UserController.getUsers)

module.exports = router