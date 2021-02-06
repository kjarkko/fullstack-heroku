const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const api = express()
const port = process.env.PORT || 3001

morgan.token('data', req => JSON.stringify(req.body))

api.use(cors())
api.use(express.json())
api.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        id: 1,
        name:'asdf',
        number: '1234'
    },{
        id: 2,
        name:'abc',
        number: '9876'
    },{
        id: 3,
        name:'xyz',
        number: '0000'
    }
]

const generateId = () => {
    return Math.floor(Math.random() * (10000000000))
}

const validate = (person) => {
    if (!person.name) {
        return "name is empty"
    } else if (!person.number) {
        return "number is empty"
    } else if (persons.find(other => person.name === other.name)) {
        return "name must be unique"
    } else {
        return null
    }
}

api.get('/info', (req, res) => {
    const date = new Date()
    res.send(`phonebook has info for ${persons.length} persons<br>${date}`)
})

api.get('/api', (req, res) => {
    res.send('<h1>asd</h1>')
}) 

api.get('/api/persons', (req, res) => {
    res.send(persons)
})

api.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

api.post('/api/persons', (req, res) => {
    const person = req.body
    const err = validate(person)
    if (err) {
        res.status(400).json({error: err})
    } else {
        const id = generateId()
        person.id = id
        persons = persons.concat(person)
        res.json(person)
    }
})

api.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id != id)

    res.status(204).end()
})

api.listen(port, () => {
    console.log(`running on ${port}`)
})
