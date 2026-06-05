const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  blog ? res.json(blog) : res.status(404).end()
})

blogsRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.title || !body.author || !body.url || !body.likes) {
    return res.status(400).json({ error: 'incomplete data' })
  }

  const blog = new Blog(body)
  const saved = await blog.save()
  res.json(saved)
})

blogsRouter.delete('/:id', async (req, res) => {
  const result = await Blog.findByIdAndDelete(req.params.id)
  result ? res.status(204).end() : res.status(404).json({ error: 'not found' })
})

blogsRouter.put('/:id', async (req, res) => {
  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  updated ? res.json(updated) : res.status(404).end()
})

module.exports = blogsRouter
