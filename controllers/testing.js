const blogsTestRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/Blog')
const User = require('../models/User')

blogsTestRouter.post('/reset', async (request, response) =>  {
    await Blog.deleteMany({})
    await User.deleteMany({})

    return response.status(204).end()
})

module.exports = blogsTestRouter