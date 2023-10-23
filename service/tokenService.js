const jwt = require('jsonwebtoken')

const tokenModel = require('../models/tokenModel')

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'}),
			refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
		return {
			accessToken,
			refreshToken
		}
	}
	validateAccessToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
			return userData
		} catch(e) {	
			return null
		}
	}
	validateRefreshToken(token) {
		try {
			const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
			return userData
		} catch(e) {	
			return null
		}
	}
	async saveToken(userId, refreshToken) {
		try {
			const tokenData = await tokenModel.findOne({user: userId})
			if(tokenData) {
				tokenData.refreshToken = refreshToken
				return tokenData.save()
			}
			const token = await tokenModel.create({user: userId, refreshToken})
			return token
		} catch (e) {
			return null
		}

	}
	async removeToken(refreshToken) {
		try {
			const tokenData = await tokenModel.deleteOne({refreshToken})
			return tokenData
		} catch (e) {
			return null
		}

	}
	async findToken(refreshToken) {
		try {
			const tokenData = await tokenModel.findOne({refreshToken})
			return tokenData
		} catch (e) {
			return null
		}
	}
}
module.exports = new TokenService()