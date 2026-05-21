require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

const password = process.argv[2]
const url = `mongodb+srv://geolilimongoatlas_db_user:${password}@cluster0.eh3maxz.mongodb.net/phonebook?appName=Cluster0`

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

/*let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "5",
      "name": "Mary Todelete", 
      "number": "39-23-0000000"
    }
]*/

/*app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})*/

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const number = persons.length
      const date = new Date()

      response.send(`
        <p>Phonebook has info for ${number} people</p>
        <p>${date}</p>
      `)
    })
    .catch(error => {
      response.status(500).json({ error: 'database error' })
    })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(person => {
    response.json(person)
  })
})

/*const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}*/

app.post('/api/persons', (request, response) => {
  const body = request.body
  //const alreadyExist = persons.find((person) => person.name.toLowerCase() === body.name?.toLowerCase())


  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  /*if(alreadyExist) {
    return response.status(400).json({ 
      error: 'name must be unique'
    })
  }*/

  const person = new Person({
      name: body.name,
      number: body.number,
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})