const blogsRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/Blog')
const User = require('../models/User')
const { response } = require('express')


blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
    const token = request.token
    if (!token || !token.id) {
      return response.status(401).json({
        error: 'token missing or invalid'
      })
    }
    const user = await User.findOne({_id : token.id})
    console.log(user)
    const blog = new Blog({
      title : request.body.title, 
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: user._id
    })
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
  })

blogsRouter.delete('/:id', async (request, response) => {
  const token = request.token
  if (!token || !token.username) {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({error: `Blog with id ${request.params.id} does not exist`})
  }
  console.log(`Token info ${token.id}`)
  console.log(`Id of the user that created the blog ${blog.user}`)
  if (token.id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  return response.status(400).json({error: `Only creator of blog has delete privellage`})
  
    
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updatedBlog = {
    title : body.title, 
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter