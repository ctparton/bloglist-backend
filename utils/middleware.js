const logger = require('./logger')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({error: 'invalid token' }) 
    }
  
    next(error)
  }

const tokenValidator = (request, response, next) => {
  const auth = request.get("Authorization")
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    request.token = jwt.verify(auth.substring(7), process.env.SECRET)
  }

  next()
  
}  
  
  module.exports = {
    errorHandler,
    tokenValidator
  }