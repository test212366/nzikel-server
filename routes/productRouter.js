 

const Router = require('express'),
	router = new Router(),
	productsController = require('../controllers/productsController')


router.post('/setProduct', productsController.setProducts)
router.get('/getProduct', productsController.getProduct)
router.post('/searchProduct', productsController.searchProduct)

module.exports = router