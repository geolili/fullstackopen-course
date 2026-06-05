const express = require('express')
const morgan = require('morgan')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
require('./utils/config') // importa connessione DB

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
