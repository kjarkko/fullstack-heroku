if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}))
app.use(express.static('build'))



app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people.map(p => p.toJSON))
  }).catch(e => {
    console.log('error in GET /api/persons/:', e)
    res.status(500).end()
  })
})
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const hlo = persons.find((p) => p.id == id)
  if(hlo)
    res.send(hlo)
  else 
    return res.status(404).end()
})
app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})
app.post('/api/persons/', (req,res) => {
  const data = req.body
  const number = data.number
  const name = data.name
  console.log(number, name)

  if(!number || !name || persons.filter(p => p.name === name).length > 0){
    res.status(400).end()
  }

  const id = Math.random() * 1000000000
  const person = {
    number: number,
    name: name,
    id: id
  }
  persons.filter(p => p.name === name)
  persons.push(person)
  res.status(201).end()
})



const port = process.env.PORT
app.listen(port)
console.log(`server running on ${port}`)