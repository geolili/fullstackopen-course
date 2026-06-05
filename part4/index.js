require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const Blog = require('./models/blog')

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('body', (req) => {
  if (!req.body) {
    return '{}'
  }

  return JSON.stringify({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    likes: req.body.likes
  })
})

app.use(
  '/api/blogs',
  morgan(':method :url :status :response-time ms :body')
)

app.get('/info', (request, response, next) => {
  Blog.find({})
    .then(blogs => {
      const number = blogs.length
      const date = new Date()

      response.send(`
        <p>Blogs list has info for ${number} blog(s)</p>
        <p>${date}</p>
      `)
    }).catch(error => next(error))
})

app.get('/api/blogs', (request, response, next) => {
  Blog.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.get('/api/blogs/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if(blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/blogs/:id', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      if (!result) {
        return response.status(404).json({
          error: 'person already removed or does not exist'
        })
      }

      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/blogs', (request, response, next) => {
  const body = request.body

  if (!body.title || !body.author || !body.url || !body.likes) {
    return response.status(400).json({
      error: 'incomple data'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save().then(savedBlog => {
    response.json(savedBlog)
  }).catch(error => next(error))
})

app.put('/api/blogs/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  Blog.findById(request.params.id)
    .then(blog => {
      if (!blog) {
        return response.status(404).end()
      }

      blog.title = title
      blog.author = author
      blog.url = url
      blog.likes = likes

      return blog.save() //since we use save validating is working
    })
    .then(updatedBlog => {
      if (updatedBlog) {
        response.json(updatedBlog)
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(unknownEndpoint) //can be tested with /ciao for example
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})