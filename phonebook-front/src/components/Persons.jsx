const Persons = ({ persons, search, deletePerson }) => {
  return (
    <div>
      {persons.filter((person) => 
        person.name.toLowerCase().includes(search.toLowerCase())
      ).map((person) => 
          <Person person={person} remove={() => deletePerson(person)} />
      )}
    </div>
  )
}

const Person = ({ person, remove }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={remove}>delete</button>
    </div>
  )
}

export default Persons