// Ajetaan komennolla 'npm run dev', jotta uudelleenkäynnistys toimii
const { request, response } = require('express')

// Pyyntöjen loggaus middleware
const express = require('express')
const morgan = require('morgan');

// Sallii frontin ja backin olevan eri origineissa
const cors = require('cors')

// Tietokantamoduuli
const Person = require('./models/person');
const { Mongoose } = require('mongoose');
const person = require('./models/person');

// Express näyttää staattista sisältöä eli mm. "index.html".
// Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin
// löytyykö pyynnön polkua vastaavan nimistä tiedostoa
// hakemistosta build. Jos löytyy, palauttaa Express tiedoston.
const app = express()
app.use(express.json())
app.use(express.static('build'))

app.use(cors())

// Morganin settarit
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));
app.listen(3002, () => {
  console.debug('# App listening on :3002');
});

// Virheidenkäsittelijät, middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  }

  if (error.name === 'DocumentNotFoundError') {
    return response.status(400).send({ error: 'Document not found while saving' })
  }

  next(error)
}

// Logataan henkilön tiedot
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

// Route '/', tapahtumankäsittelijä juureen tuleville pyynnöille
app.get('/', (reguest, response) => {
  // Koska parametri on merkkijono, asettaa express vastauksessa
  // content-type-headerin arvoksi text/html, statuskoodiksi
  // tulee oletusarvoisesti 200
  response.send('<h1>Hello World!</h1>')
  console.log('# GET request on /')
})

// Tapahtumankäsittelijä infosivulle
app.get('/info', (reguest, response) => {
  const count = persons.length
  const date = new Date()
  response.send(`The phonebook has info for ${count} people <br/> ${date}`)
  console.log('# GET request on /info')
})

// Route '/api/persons', tapahtumankäsittelijä
// Serveriltä haetaan lista henkilöistä
app.get('/api/persons', (request, response) => {
  // Numerotietojen haku tietokannasta
  Person.find({}).then(persons => {
    response.json(persons)
  })
  console.log('# GET request on /api/persons')
})

// Henkilö haetaan id:n perusteella
// Next siirtää virhetilanteiden käsittelyn eteenpäin
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person ) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Henkilön tietojen päivitys
app.put('/api/persons/:id', (request, response, next) =>{

  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
    console.log(`# Updated ${updatedPerson}`)
  })
  .catch(error => next(error))
})

// Henkilön poisto puhelinluettelosta
app.delete('/api/persons/:id', (request, response, next) => {
  // Poistetaan henkilö tietokannasta id:n perusteella
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const findPerson = (person) => {
  const found = Person.find({ name: person })
  return found
}

app.post('/api/persons', (request, response, next) => {

  const body = request.body

  // Poistutaan, jos nimi puuttuu
  if (!body.name) {
    console.log("# Add a new person: name missing")
    return response.status(400).json({
      error: 'Name missing'
    })
  }
  // Poistutaan, jos numero puuttuu
  if (!body.number) {
    console.log("# Add a new person: number missing")
    return response.status(400).json({
      error: 'Number missing'
    })
  }

  /*
  // Poistutaan, jos nimi löytyy jo
  if (findPerson(body.name)) {
        console.log("# Add a new person: name already in phonebook")
    return response.status(400).json({
      error: 'Name already in phonebook'
    })
  }
  */

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(response => 
    console.log(`# Added '${body.name}' number '${body.number}' to phonebook`)
  ).catch(error => next(error))

  response.json(newPerson)
})

// Middleware, jonka ansiosta saadaan routejen käsittelemättömistä
// virhetilanteista JSON-muotoinen virheilmoitus
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
  console.log('# Unknown endpoint')
}

// Olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

// Virheellisten pyyntöjen käsittely
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`# Server running on port ${PORT}`)
})