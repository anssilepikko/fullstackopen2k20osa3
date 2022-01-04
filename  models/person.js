// Mongoose MongoDB
const mongoose = require('mongoose')

// Ympäristömuuttujat
require('dotenv').config()

// Haetaan URL ympäristömuuttujasta
const url = process.env.MONGODB_URI
// Haetaan portti ympäristömuuttujasta
const PORT = process.env.PORT

// Yhteyden muodostus tietokantaan
console.log('# Connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('# Connected to MongoDB')
    })
    .catch((error) => {
        console.log('# Error connecting to MongoDB:', error.message)
    })

// Skeeman määritys
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Skeeman muuntaminen JSON-muotoon
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

// Moduulin ulos näkyvä osa määritellään asettamalla arvo muuttujalle module.exports
module.exports = mongoose.model('Person', personSchema)