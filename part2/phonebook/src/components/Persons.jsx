const Persons = ({persons, searchName, handleDeletePerson}) => {
    return (
        <>
        {persons.map(person => (
            person.name.toLowerCase().includes(searchName.toLowerCase()) && 
            <div key={person.id}>
                <span>{person.name} {person.number}</span>
                <button style={{marginLeft: '10px'}} onClick={() => handleDeletePerson(person)}>delete</button>
            </div>
        ))}
      </>
    )
}

export default Persons