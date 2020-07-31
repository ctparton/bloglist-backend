const mongoose = require('mongoose')
const supertest = require('supertest')
const apiTestHelper = require('./bloglist_api_test_helper')
const app = require('../app')
const blogListApi = supertest(app)
const Blog = require('../models/Blog')
const { replaceOne } = require('../models/Blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log(`Blogs in database cleared down`)

    const blogs = apiTestHelper.blogs.map(blog => new Blog(blog))
    const savedBlogs = blogs.map(blog => blog.save())
    await Promise.all(savedBlogs)
})

test('blogs are returned as json', async () => {
    await blogListApi
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

test('blogs have a unique id paramater', async () => {
    const blogs = await blogListApi.get('/api/blogs')
    blogs.body.forEach(() => {
        blog => expect(blog.id).toBeDefined()})
})

test('Writing a new blog post', async () => {
    const newBlog = {
        title: "Will posting this work?",
        author: "Test Man",
        url: "callumparton.me/testpost",
        likes: "8"
      }
  
      await blogListApi.post('/api/blogs')
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
  
      const blogsAfterPost = await apiTestHelper.blogsInDb()
      expect(blogsAfterPost.length).toBe(apiTestHelper.blogs.length + 1)
      const contents = blogsAfterPost.map(blog => blog.title)
  
      expect(contents).toContain('Will posting this work?')
})

test('Likes property to default to 0 if absent', async () => {
    const newBlog = {
        title: "Will this post get any likes?",
        author: "Test No likes",
        url: "callumparton.test/testffost"
      }

    await blogListApi.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await apiTestHelper.blogsInDb()
    const blogWithoutLikes = blogsAfterPost.find(blog => blog.author === "Test No likes")
    expect(blogWithoutLikes.likes).toBe(0)
})

test(`Check that missing url and title in new blog results in bad request`, async () => {
    const newBlog = {
        author: "No title, no url",
        likes: "50"
    }

    const response = await blogListApi.post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain("Blog validation failed: title: Path `title` is required., url: Path `url` is required.")
})

test('Check note has been deleted', async () => {
    const newBlog = {
        title: "This post is going to be deleted",
        author: "Forbidden Author",
        url: "callumparton.test/testffost"
      }

    const response = await blogListApi.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await blogListApi
        .delete(`/api/blogs/${response.body.id}`)
        .expect(204)
    
})

test('Check blog has been updated', async () => {
    const newBlog = {
        title: "This post will be updated with new likes",
        author: "first author",
        url: "choco.io",
        likes: 10
      }

    const postResponse = await blogListApi.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = {
        title: "This post will be updated with new likes",
        author: "first author",
        url: "choco.io",
        likes: 10032040
    }
    const response = await blogListApi
        .put(`/api/blogs/${postResponse.body.id}`)
        .send(updatedBlog)
        .expect(200)
    
    console.log(response.body)
})
afterAll(() => {
    mongoose.connection.close()
})