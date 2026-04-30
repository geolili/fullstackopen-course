const Persons = ({persons, searchName}) => {
    return (
        <>
        {persons.map(person => (
            person.name.toLowerCase().includes(searchName.toLowerCase()) && 
            <p key={person.id}>{person.name} {person.number}</p>
        ))}
      </>
    )
}

export default Persons