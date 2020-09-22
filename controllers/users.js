const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

usersRouter.post('/', async (request, response, next)  => {
  const body = request.body

  if (!body.password || body.password.length < 4) {
    return response.status(400).json({error: "Password greater than 3 characters must be given"})
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    password: passwordHash,
  })

  const userSave = await user.save()
  response.json(userSave)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs')
  response.json(user)
})

module.exports = usersRouter