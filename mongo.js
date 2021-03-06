const mongoose = require('mongoose')

// Komentoriviparametrien haku
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

// Mongosen url
const url =
  `mongodb+srv://fullstackopen:${password}@fullstackopen.bxu5g.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url)

// Mongosen skeema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Numerotietojen haku komennolla
// 'node mongo.js salasana'
if (process.argv.length<4) {
    console.log('phonebook:')

    Person
    .find({})
    .then(persons => {
        persons.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
        process.exit(1)
    })
}

// Uuden numeron lisäys komennolla
// 'node mongo.js nimi numero'
if (process.argv.length==5) {
const person = new Person({
  name: name,
  number: number,
})

person.save().then(response => {
  console.log(`added '${name}' number '${number}' to phonebook`)
  mongoose.connection.close()
})
}
