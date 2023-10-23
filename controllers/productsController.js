const productService = require("../service/productService")


class ProductController  {
	async setProducts(req, res, next) {
		try {
			const products = req.body,
				product = await productService.setProducts(products)
			return res.json({message: 'new products added', product})
		} catch(e) {
			next(e)
		}
	}
	async getProduct(req, res, next) {
		try {	
			const products = await productService.getProduct()
			return res.json(products)
		} catch(e) {
			next(e)
		}
	}
	async searchProduct(req, res, next) {
		try {
			const {titleProduct} = req.body,
				products = await productService.searchProduct(titleProduct)
			return res.json(products)
		} catch(e) {
			next(e)
		}
	}
}	
module.exports = new ProductController()