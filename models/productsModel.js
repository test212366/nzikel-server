const { Schema, model } = require("mongoose");

const ProductSchema = new Schema({
	type: {type: String, required: true},
	titleTwoSpan: {type: String},
	heightIMG: {type: String},
	classIMG:{type: String},
	sourseURL:{type: String},  
	title: {type: String},
	subTitle: {type: String},
	price: {type: Number},
	sizes: {type: Array},
	description: {type: String},
	colors: {type: Array},
	url: {type: String}
})
module.exports = model('Product', ProductSchema)