const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@fullstackopen.ufoo92d.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(() => { console.log('connected to MongoDB')})  
  .catch((error) => { console.log('error connecting to MongoDB:', error.message)})

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
    return
  })
}
else {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((error) => { console.log('error saving to MongoDB:', error.message)  
      mongoose.connection.close()
    })
}