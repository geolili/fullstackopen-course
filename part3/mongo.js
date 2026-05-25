const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const dataName = process.argv[3]
const dataNumber = process.argv[4]
const url = `mongodb+srv://geolilimongoatlas_db_user:${password}@cluster0.eh3maxz.mongodb.net/phonebook?appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

const getAllPerson = () => {

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)

    })
    mongoose.connection.close()
  })
}

const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

if(typeof dataName !== 'undefined' && typeof dataNumber !== 'undefined') {
  addPerson(dataName, dataNumber)
} else {
  getAllPerson()
}









