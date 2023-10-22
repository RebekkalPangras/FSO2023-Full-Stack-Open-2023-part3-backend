const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :req[content-length] :response-time ms :req-body'));

morgan.token('req-body', req => JSON.stringify(req.body))

let persons = [
    {
        "name": "Arto Hellas",
        "id": 1,
        "number": "39-44-5323521"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Alex",
        "number": "123-1234-1234",
        "id": 5
    },
    {
        "name": "Mary Alex",
        "number": "234-3456-234",
        "id": 6
    },
    {
        "name": "Rebecca Venkat",
        "number": "403-000-0000",
        "id": 7
    },
    {
        "name": "Venzet Krish",
        "number": "403-333-3333",
        "id": 8
    }
]

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})

app.post('/api/persons', (request, response) => {
    const max = 100
    const min = 8
    const person = request.body

    if (person.name === undefined || person.number === undefined) return response.status(400).send({ error: "Name or Number missing" })
    if ((persons.filter(p => p.name === person.name)).length > 0) return response.status(400).send({ error: "Name must be unique" })

    person.id = Math.floor(Math.random() * (max - min) + min)
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const reqId = Number(request.params.id)
    const person = persons.find(person => person.id === reqId)
    if (person) response.json(person)
    else response.status(404).send({ 'error': 'no data exists for the given id' })
})

app.delete('/api/persons/:id', (request, response) => {
    const reqId = Number(request.params.id)
    persons = persons.filter(person => person.id != reqId)
    response.status(204).end()
})

const PORT = process.env.port || 3001
app.listen(PORT, () => console.log("Started listening on port 3001"))