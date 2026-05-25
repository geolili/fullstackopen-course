require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (!req.body) {
    return '{}'
  }

  return JSON.stringify({
    name: req.body.name,
    number: req.body.number
  })
})

app.use(
  '/api/persons',
  morgan(':method :url :status :response-time ms :body')
)

app.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      const number = persons.length
      const date = new Date()

      response.send(`
        <p>Phonebook has info for ${number} people</p>
        <p>${date}</p>
      `)
    }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
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

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save() //since we use save validating is working
    })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
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