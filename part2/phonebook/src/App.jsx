import { useState, useEffect, deleteConfirmation} from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

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
          setMessage(`${newName} successfully updated`)
        })
        .catch(error => { //tested with server down
          setError(true)
          setMessage(
            `Something went wrong: ${error.response.data.error}` //changed a name on db to a 2 caracters long to test
          )
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
        setMessage(`${newName} successfully added`)
      })
      .catch(error => { //tested with server down
        setError(true)
        setMessage(
          `Something went wrong: ${error.response.data.error}`
        )
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
        setMessage(`${person.name} successfully deleted`)
      })
      .catch(error => {
        setError(true)
        setMessage(
          `Information of '${person.name}' has already been removed from server`
        )
      })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} setMessage={setMessage} error={error}/>
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