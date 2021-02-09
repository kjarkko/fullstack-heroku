const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config()

const api = express()
const port = process.env.PORT || 3001

morgan.token('data', req => JSON.stringify(req.body))

api.use(cors())
api.use(express.json())
api.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
api.use(express.static('build'))


api.get('/info', (req, res, next) => {
    Person.find({}).then(persons => {
        const date = new Date()
        res.send(`phonebook has info for ${persons.length} persons<br>${date}`)
    }).catch(err => next(err))
})

api.get('/api', (req, res) => {
    res.send('<h1>asd</h1>')
}) 

api.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.send(persons)
    }).catch(err => next(err))
})

api.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).json({error: 'could not find person'})
        }
    }).catch(err => next(err))
})

api.post('/api/persons', (req, res, next) => {
    const body = req.body
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(saved => {
        res.json(saved)
    }).catch(err => next(err))
})

api.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(req.params.id, person, {new: true}).then(result => {
        res.json(result)
    }).catch(err => next(err))
})

api.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id).then(() => {
        res.status(204).end()
    }).catch(err => next(err))
})

api.listen(port, () => {
    console.log(`running on ${port}`)
})


const errorHandler = (err, req, res, next) => {
    console.error(err.message)
  
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }
  
    next(err)
}

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

api.use(errorHandler)
api.use(unknownEndpoint)
