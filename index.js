// Ajetaan komennolla 'npm run dev', jotta uudelleenkäynnistys toimii
const { request, response } = require('express')
// Pyyntöjen loggaus middleware
const express = require('express')
const morgan = require('morgan');
// Sallii frontin ja backin olevan eri origineissa
const cors = require('cors')

const app = express()
app.use(express.json())
// Express näyttää staattista sisältöä eli mm. "index.html".
// Express GET-tyyppisten HTTP-pyyntöjen yhteydessä ensin
// löytyykö pyynnön polkua vastaavan nimistä tiedostoa
// hakemistosta build. Jos löytyy, palauttaa Express tiedoston.
app.use(express.static('build'))
app.use(cors())

// Morganin settarit
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));
app.listen(3002, () => {
  console.debug('App listening on :3002');
});

// Logataan henkilön tiedot
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '091847567'
  },
  {
    id: 2,
    name: 'Katto Kassinen',
    number: '059566409'
  },
  {
    id: 3,
    name: 'Kaapo Kaulin',
    number: '026740567'
  },
  {
    id: 4,
    name: 'Kierre Kulmikas',
    number: '018465595'
  },
  {
    id: 5,
    name: 'Kaato Kolmikas',
    number: '027595649'
  }
]

// Route '/', tapahtumankäsittelijä juureen tuleville pyynnöille
app.get('/', (reguest, response) => {
  // Koska parametri on merkkijono, asettaa express vastauksessa
  // content-type-headerin arvoksi text/html, statuskoodiksi
  // tulee oletusarvoisesti 200
  response.send('<h1>Hello World!</h1>')
  //console.log('GET request on /')
})

// Tapahtumankäsittelijä infosivulle
app.get('/info', (reguest, response) => {
  const count = persons.length
  const date = new Date()
  response.send(`The phonebook has info for ${count} people <br/> ${date}`)
  //console.log('GET request on /info')
})

// Route '/api/persons', tapahtumankäsittelijä
// Serveriltä haetaan lista henkilöistä
app.get('/api/persons', (request, response) => {
  // Data muuttuu automaattisesti JSON-muotoon, kun käytetään Expressiä
  response.json(persons)
  //console.log('GET request on /api/persons')

})

// Henkilö haetaan id:n perusteella
app.get('/api/persons/:id', (request, response) => {
  // Muutetaan merkkijono-muotoinen id numeroksi
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  //console.log(`GET request by id ${id}`)

  if (person) {
    response.json(person)
    //console.log(`Person found found`)
  }
  else {
    // Vastataan statuskoodi 404:llä, jos ei löydy eli find antaa 'undefined'
    response.status(404).end()
    //console.log(`Person not found`)
  }
})

// Henkilön poisto puhelinluettelosta
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // Filtteröi pois haetun henkilön id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
  //console.log(`Deleted person with ${id}`)
})

// Id-numeron generointi
// Persons.map(n => n.id) muodostaa taulukon, joka
// koostuu muistiinpanojen id-kentistä. Math.max palauttaa maksimin sille
// parametrina annetuista luvuista. persons.map(n => n.id) on kuitenkin taulukko,
// joten se ei kelpaa parametriksi komennolle Math.max. Taulukko voidaan
// muuttaa yksittäisiksi luvuiksi käyttäen taulukon spread-syntaksia, eli
// kolmea pistettä ...taulukko.
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

// Nimien etsintä, joka palauttaa totuusarvon
const findPerson = (person) => {
  // Käydään nimet läpi
  // Palautetaan true, jos löytyy
  // Palautetaan false, jos ei löydy
  const found = persons.find(item => item.name === person)
  return found
}

// Uuden henkilön lisääminen
app.post('/api/persons', (request, response) => {
  // Tapahtumankäsittelijäfunktio pääsee dataan käsiksi olion
  // request kentän body avulla

  // Ilman json-parserin lisäämistä eli komentoa app.use(express.json())
  // pyynnön kentän body arvo olisi ollut määrittelemätön. Json-parserin
  // toimintaperiaatteena on, että se ottaa pyynnön mukana olevan JSON-muotoisen
  // datan, muuttaa sen JavaScript-olioksi ja sijoittaa request-olion
  // kenttään body ennen kuin routen käsittelijää kutsutaan.

  const body = request.body

  // Poistutaan, jos nimi puuttuu
  if (!body.name) {

    return response.status(400).json({
      error: 'Name missing'
    })
  }
  // Poistutaan, jos numero puuttuu
  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  }

  // Poistutaan, jos nimi löytyy jo
  if (findPerson(body.name)) {
    return response.status(400).json({
      error: 'Name already in phonebook'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
    date: new Date(),
  }

  persons = persons.concat(person)
  response.json(person)
  //console.log("A new person added to the phonebook")
})

// Middleware, jonka ansiosta saadaan routejen käsittelemättömistä
// virhetilanteista JSON-muotoinen virheilmoitus
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
  //console.log("Unknown endpoint")
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})