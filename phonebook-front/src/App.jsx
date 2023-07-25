import './index.css'

import { useState, useEffect } from 'react'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import SearchBox from './components/SearchBox'
import PersonService from './services/Persons'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <p className={message.type}>
      {message.text}
    </p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    PersonService
      .getAll()
      .then(response => {setPersons(response.data)})
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const person = persons.find((elem) => elem.name === newName)
    if (person != undefined) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with this one?`)) {
        updatePerson(person)
      }
      return
    }

    const personObject = { name: newName, number: newNumber }

    PersonService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setMessage({ type: 'success', text: `${response.data.name} added.`})
        setTimeout(() => setMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      })
      return
  }

  const updatePerson = (person) => {
    PersonService
      .update(person.id, {...person, number: newNumber})
      .then(response => {
        setPersons(persons.map((item) => 
          item.id != person.id ? item : response.data
        ))
        setMessage({ type: 'success', text: `${response.data.name} updated.`})
        setTimeout(() => setMessage(null), 5000)
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (person) => {
    if (!window.confirm(`Really delete ${person.name}?`)) {
      return
    }

    PersonService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((item) => item.id != person.id))
        setMessage({ type: 'success', text: `${person.name} deleted.`})
        setTimeout(() => setMessage(null), 5000)
      })
      .catch(error => {
        setPersons(persons.filter((item) => item.id != person.id))
        setMessage({ type: 'error', text: `${person.name} not found.`})
        setTimeout(() => setMessage(null), 5000)
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <SearchBox search={search} handleSearch={handleSearch} />
      <h2>Add new entry</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} deletePerson={deletePerson} />
    </div>    
  )
}

export default App