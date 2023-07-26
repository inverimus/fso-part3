require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => { 
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['body'](req, res)
  ].join(' ')
}))

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people<p><p>${Date(Date.now()).toString()}</p>`)
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing'})
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing'})
  }
  Person.findOne({ name: body.name }).then(result => {
    if (result) {
      return response.status(400).json({ error: 'name must be unique'})
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
    
      person.save().then(savedPerson => {
        response.json(savedPerson)
      })
    }
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})