// Ajetaan komennolla 'npm run dev', jotta uudelleenkäynnistys toimii
const { request, response } = require('express')
const express = require('express')
const app = express()
// Expressin json-parser
app.use(express.json())

const persons = [
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

// Route '/', tapahtumankäsittelijä juureen tuleville
// pyynnöille
app.get('/', (reguest, response) => {
  // Koska parametri on merkkijono, asettaa express vastauksessa
  // content-type-headerin arvoksi text/html, statuskoodiksi
  // tulee oletusarvoisesti 200
  response.send('<h1>Hello World!</h1>')
})

// Route '/api/persons', tapahtumankäsittelijä em.
// osoitteeseen tuleville pyynnöille
app.get('/api/persons', (request, response) => {
  // Data muuttuu automaattisesti JSON-muotoon, kun käytetään Expressiä
  response.json(persons)
  console.log("GET")
})

app.get('/api/persons/:id', (request, response) => {
  // Muutetaan merkkijono-muotoinen id numeroksi
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  console.log(`GET ${id}`)

  if (person) {
    response.json(person)
  }
  else
    // Vastataan statuskoodi 404:llä, jos ei löydy eli find antaa 'undefined'
    response.status(400).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/persons', (request, response) => {
  // Tapahtumankäsittelijäfunktio pääsee dataan käsiksi olion
  // request kentän body avulla

  // Ilman json-parserin lisäämistä eli komentoa app.use(express.json())
  // pyynnön kentän body arvo olisi ollut määrittelemätön. Json-parserin
  // toimintaperiaatteena on, että se ottaa pyynnön mukana olevan JSON-muotoisen
  // datan, muuttaa sen JavaScript-olioksi ja sijoittaa request-olion
  // kenttään body ennen kuin routen käsittelijää kutsutaan.

  const body = request.body

  if (!body.content) {
    // Poistutaan, jos datalla ei sisältöä
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
    date: new Date(),
  }
  
  persons = persons.concat(person)

  response.json(person)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)