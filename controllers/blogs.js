const blogsRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/Blog')
const { response } = require('express')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog({
      title : request.body.title, 
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0
    })
    const result = await blog.save()
    response.status(201).json(result)
  })

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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