 
const userService = require('../service/userService'),
	{validationResult} = require('express-validator'),
	ApiError = require('../exceptions/apiErrors')
 
class UserController {
	async register(req, res, next) {
		try {
			const errors = validationResult(req)
			if(!errors.isEmpty()) return next(ApiError.BadRequest('Error in valid', errors.array()))
			const {email, password} = req.body,
				userData = await userService.registration(email, password)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		} catch(e) {
			next(e)
		}
		 
	}
	async login(req, res, next) {
		try {
			const {email, password} = req.body,
				userData = await userService.login(email, password)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		} catch(e) {
			next(e)
		}
		 
	}
	async logout(req, res, next) {
		try {
			const {refreshToken} = req.cookies,
				token = await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			return res.json(token)
		} catch(e) {
			next(e)
		}
		 
	}
	async activate(req, res, next) {
		try {
			const activationLink = req.params.link	 
			await userService.activate(activationLink)
			return res.redirect(process.env.CLIENT_URL)
		} catch(e) {
			next(e)
		}
		 
	}
	async refresh(req, res, next) {
		try {
			const {refreshToken} = req.cookies,
				userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
			return res.json(userData)
		} catch(e) {
			next(e)
		}
		 
	}
	async getUsers(req,res, next) {
		try {
			const users = await userService.getAllUsers()
			return res.json(users)
		} catch(e) {
			next(e)
		}
	}
	 
}
module.exports = new UserController()