const Course = ({ course }) => {
    return (
    <div>
      <h1>{course.name}</h1>
      <div>
        {course.parts.map(part => (
          <p key={part.id}>
            {part.name} {part.exercises}
          </p>
        ))}
      </div>
      <h3>Total of exercises {course.parts.reduce((total,part) =>  total = total + part.exercises , 0 )}</h3>
    </div>
  )
}

export default Course