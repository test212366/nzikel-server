const Router = require('express'),
	router = new Router(),
	userRouter = require('./userRouter'),
	productRouter = require('./productRouter')

router.use('/user', userRouter)
router.use('/product', productRouter)

module.exports = router