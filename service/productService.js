const productModel = require('../models/productsModel')

class ProductService {
	async setProducts({type, classIMG, colors, description, heightIMG, price, sizes, sourseURL, subTitle, title, titleTwoSpan, url}) {
		try {
			const product = await productModel.create({
				type,
				classIMG,
				colors,
				description,
				heightIMG,
				price,
				sizes,
				sourseURL,
				subTitle,title,titleTwoSpan, url
			})
			return product
		} catch(e) {
			return null
		}
	}
	async getProduct() {
		try {
			const product = await productModel.find({})
			return product
		} catch (e) {
			return null
		}
	}
	async searchProduct(titleProduct) {

		const products = await productModel.find({type: titleProduct})
		return products
	}
}
module.exports = new ProductService()