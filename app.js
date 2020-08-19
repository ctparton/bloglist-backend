const express = require('express')
const app = express()
const logger = require('./utils/logger')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config.js')
const customMiddleware = require('./utils/middleware')

const mongoUrl = config.MONGODB_URI
mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => logger.info(`Successfully connected to ${mongoUrl}`))


app.use(cors())
app.use(express.json())
app.use(customMiddleware.tokenValidator)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(customMiddleware.errorHandler)

module.exports = app