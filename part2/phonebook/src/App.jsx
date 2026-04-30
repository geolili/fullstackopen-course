import { useState, useEffect, deleteConfirmation} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './components/services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)      
    })
  }, [])

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

    const nameObject = {
      name: newName,
      number: newNumber
    }

    const alreadyExist = persons.find((person) => person.name.toLowerCase() === newName.toLowerCase())

    if(alreadyExist) {
      //* exercise doing it for fun not for grade
      //alert(`${newName} is already added to phonebook`)
      //return
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {

        personsService.update(alreadyExist.id, nameObject)
        .then(() => {
          return personsService.getAll()
        })
        .then(data => {
          setPersons(data)
          setNewName('')
          setNewNumber('')
          setSearchName('')
        })
      }
    } else {
      personsService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))        
        setNewName('')
        setNewNumber('')
        setSearchName('')
      })
    }
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.deletePerson(person.id)
      .then(() => {
        return personsService.getAll()
      })
      .then(data => {
        setPersons(data)
      })
    }
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
      <Persons persons={persons} searchName={searchName} handleDeletePerson={handleDeletePerson} />
    </div>
  )
}

export default App