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
    res.json(people.map(p => p.toJSON()))
  }).catch(e => {
    console.log('error in GET /api/persons/', e)
    res.status(500).end()
  })
})
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON())
  }).catch(e => {
    console.log('error in GET /api/persons/:id', e)
  })
  /*const id = Number(req.params.id)
  const hlo = persons.find((p) => p.id == id)
  if(hlo)
    res.send(hlo)
  else 
    return res.status(404).end()*/
})
app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  Person.findByIdAndDelete(id)
  res.status(204).end()
})
app.post('/api/persons/', (req,res) => {
  const data = req.body
  const person = new Person({
    number: data.number,
    name: data.name
  })

  if(!person.number || !person.name){
    res.status(400).end()
  }
  person.save().then(saved => {
    res.json(saved.toJSON())
  }).catch(e => console.log('error in POST /api/persons/', e))
})



const port = process.env.PORT
app.listen(port)
console.log(`server running on ${port}`)