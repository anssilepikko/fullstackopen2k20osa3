// Ympäristömuuttujat
require('dotenv').config()

// Pyyntöjen loggaus middleware
const express = require('express')

const app = express()

const morgan = require('morgan')

// Sallii frontin ja backin olevan eri origineissa
const cors = require('cors')

// Tietokantamoduuli
const Person = require('./models/person')

// Express näyttää staattista sisältöä eli mm. "index.html".
// Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin
// löytyykö pyynnön polkua vastaavan nimistä tiedostoa
// hakemistosta build. Jos löytyy, palauttaa Express tiedoston.
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

// Morganin settarit
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

// Virheidenkäsittelijät, middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// Logataan henkilön tiedot
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

// Route '/', tapahtumankäsittelijä juureen tuleville pyynnöille
// Tällä hetkellä juuresta tarjoillaan staattista frontendiä
app.get('/', (reguest, response) => {
  // Koska parametri on merkkijono, asettaa express vastauksessa
  // content-type-headerin arvoksi text/html, statuskoodiksi
  // tulee oletusarvoisesti 200
  response.send('<h1>Phonebook</h1>')
  console.log('GET request on /')
})

// Tapahtumankäsittelijä infosivulle
app.get('/info', (reguest, response, next) => {
  const date = new Date()
  Person.estimatedDocumentCount().then((count) => {
    response.send(`The phonebook has info for ${count} people <br/> ${date}`)
    console.log('GET request on /info')
  })
    .catch((error) => next(error))
})

// Route '/api/persons', tapahtumankäsittelijä
// Serveriltä haetaan lista henkilöistä
app.get('/api/persons', (request, response) => {
  // Numerotietojen haku tietokannasta
  Person.find({}).then((persons) => {
    response.json(persons)
  })
  console.log('GET request on /api/persons')
})

// Henkilö haetaan id:n perusteella
// Next siirtää virhetilanteiden käsittelyn eteenpäin
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

// Henkilön tietojen päivitys
app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request // const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
      console.log(`Updated ${updatedPerson}`)
    })
    .catch((error) => {
      console.log(`Error updating a person on phonebook`)
      next(error)
    })
})

// Henkilön poisto puhelinluettelosta
app.delete('/api/persons/:id', (request, response, next) => {
  // Poistetaan henkilö tietokannasta id:n perusteella
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// Henkilön lisäys puhelinluetteloon
app.post('/api/persons', (request, response, next) => {
  const { body } = request

  // Poistutaan, jos nimi puuttuu
  if (!body.name) {
    console.log('Add a new person: name missing')
    return response.status(400).json({ error: 'Name missing' })
  }
  // Poistutaan, jos numero puuttuu
  if (!body.number) {
    console.log('Add a new person: number missing')
    return response.status(400).json({ error: 'Number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson)
      console.log(`New person added ${savedAndFormattedPerson}`)
    })
    .catch((error) => {
      console.log(`Error adding a new person to phonebook`)
      next(error)
    })
})

// Middleware, jonka ansiosta saadaan routejen käsittelemättömistä
// virhetilanteista JSON-muotoinen virheilmoitus
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
  console.log('Unknown endpoint')
}

// Olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

// Virheellisten pyyntöjen käsittely
app.use(errorHandler)

const { PORT } = process.env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
