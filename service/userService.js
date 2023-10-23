const UserDto = require('../dtos/userDto'),
	ApiError = require('../exceptions/apiErrors'),
	userModel = require('../models/userModel'),
	UserModel = require('../models/userModel'),
	bcrypt = require('bcrypt'),
	uuid = require('uuid')
 
const mailService = require('./mailService'),
	tokenService = require('./tokenService')

class UserService {
	async registration(email, password) {
		const candidate = await UserModel.findOne({email})
		if (candidate) throw ApiError.BadRequest(`User email ${email} used`)
		const hashPassword = await bcrypt.hash(password, 3),
			activationLink = uuid.v4(),
			user = await UserModel.create({email, password: hashPassword, activationLink})
		await mailService.sendActivationEmail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
		const userDto = new UserDto(user),
			tokens = tokenService.generateTokens({...userDto})
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return {
			...tokens,
			user: userDto
		}
	}
	async activate(activationLink) {
		const user = await UserModel.findOne({activationLink})
		if(!user) throw ApiError.BadRequest('Error link activated')
		user.isActivated = true
		await user.save()
	}
	async login(email, password) {
		const user = await UserModel.findOne({email})
		if(!user) throw ApiError.BadRequest('email is not defined')
		const isPassEquals = await bcrypt.compare(password, user.password)
		if(!isPassEquals) throw ApiError.BadRequest('password not equal')
		const userDto = new UserDto(user),
			tokens = tokenService.generateTokens({...userDto})
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return {
			...tokens,
			user: userDto
		}
	}
	async logout(refreshToken) {
		const token = await tokenService.removeToken(refreshToken)
		return token
	}
	async refresh(refreshToken) {
		if(!refreshToken) throw ApiError.UnauthorizedError()
		const userData = tokenService.validateRefreshToken(refreshToken),
			tokenFromDB = await tokenService.findToken(refreshToken)
		if(!userData || !tokenFromDB) throw ApiError.UnauthorizedError()
		const user = await userModel.findById(userData.id),
			userDto = new UserDto(user),
			tokens = tokenService.generateTokens({...userDto})
		await tokenService.saveToken(userDto.id, tokens.refreshToken)
		return {
			...tokens,
			user: userDto
		}
	}
	async getAllUsers() {
		const users = await userModel.find({})
		return users
	}
}
module.exports = new UserService()