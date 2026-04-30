const Filter = ({ searchName, onSearchChange }) => {
  return (
    <div>
      Filter shown with:
      <input value={searchName} onChange={onSearchChange} />
    </div>
  )
}

export default Filter