// Ajetaan komennolla 'npm run dev', jotta uudelleenkäynnistys toimii
const { request, response } = require('express')
const express = require('express')
const app = express()
// Expressin json-parser
app.use(express.json())

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

// Route '/', tapahtumankäsittelijä juureen tuleville
// pyynnöille
app.get('/', (reguest, response) => {
  // Koska parametri on merkkijono, asettaa express vastauksessa
  // content-type-headerin arvoksi text/html, statuskoodiksi
  // tulee oletusarvoisesti 200
  response.send('<h1>Hello World!</h1>')
})

// Infosivu
app.get('/info', (reguest, response) => {
  const count = persons.length
  const date = new Date()
  response.send(`The phonebook has info for ${count} people <br/> ${date}`)
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
  console.log(`GET id ${id}`)

  if (person) {
    response.json(person)
    console.log(person)
  }
  else {
    // Vastataan statuskoodi 404:llä, jos ei löydy eli find antaa 'undefined'
    response.status(404).end()
    console.log(`${id} not found`)
  }
})

// Henkilön poisto puhelinluettelosta
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  // Filtteröi pois haetun henkilön id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
  console.log(`Deleted person with ${id}`)
})

// Mitä rivillä tapahtuu? persons.map(n => n.id) muodostaa taulukon, joka
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

  if (!body.name) {
    // Poistutaan, jos datalla ei sisältöä
    return response.status(400).json({
      error: 'Name missing'
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
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)