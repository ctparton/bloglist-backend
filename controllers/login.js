const loginRouter = require('express').Router()
require('express-async-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const { response } = require('express')
require('dotenv').config()

loginRouter.post('/', async (request, response)  => {
    const body = request.body
    const user = await User.findOne({username : body.username})
    
    if (!body.password) {
        return response.status(400).json({error: "Provide a password"})
    }
    const userValid = user === null 
        ? false 
        : await bcrypt.compare(body.password, user.password)
  

    if (!(user && userValid)) {
        return response.status(401).json({
          error: 'invalid username or password'
        })
      }

    const userToSign = {
        username: user.username,
        id: user.id 
    }
    const token = jwt.sign(userToSign, process.env.SECRET)
    response.status(200).send({token, username: user.username, name: user.name})

})
module.exports = loginRouter