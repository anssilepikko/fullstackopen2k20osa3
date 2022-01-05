// Mongoose MongoDB
const mongoose = require('mongoose')
// Validaattori
const uniqueValidator = require('mongoose-unique-validator')

// Haetaan URL ympäristömuuttujasta
const url = process.env.MONGODB_URI
// Haetaan portti ympäristömuuttujasta
const PORT = process.env.PORT

// Yhteyden muodostus tietokantaan
console.log('Connecting to', url)
mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    })

// Skeeman määritys
var personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        unique: true,
        minlength: 8
    },
})

personSchema.plugin(uniqueValidator)

// Skeeman muuntaminen JSON-muotoon
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

// Moduulin ulos näkyvä osa määritellään asettamalla arvo muuttujalle module.exports
module.exports = mongoose.model('Person', personSchema)