import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearchName(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()

    if(newName === '') {
      alert(`The name can't be empty`)
      return
    }

    if(newNumber === '') {
      alert(`The phone number can't be empty`)
      return
    }

    const alreadyExist = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase())

    if(alreadyExist) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
    setSearchName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        searchName={searchName} 
        onSearchChange={handleSearchChange} 
      />
      <h3>Add a new:</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumChange={handleNumChange} addName={addName} />

      <h2>Numbers</h2>

      <Persons persons={persons} searchName={searchName} />
      
    </div>
    
  )
}

export default App