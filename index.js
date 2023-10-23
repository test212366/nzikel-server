require('dotenv').config()

const express = require('express'),
	cors = require('cors'),
	router = require('./routes/index'),
	mongoose = require('mongoose'),
	cookieParser = require('cookie-parser'),
	errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()
app.use(cors({
	credentials: true,
	origin: process.env.CLIENT_URL
}))
app.use(express.json({extended: true}))
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)
 
// anonum func, ; без этого не работает вызов анонимки
;(async () => {
	try {
		await mongoose.connect(process.env.DB_URL)
		app.listen(process.env.PORT || 6000, () => console.log('server started', process.env.PORT ))
	} catch(e) {
		console.log(e)
	}
})()
 