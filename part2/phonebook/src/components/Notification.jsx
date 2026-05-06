const Notification = ({ message, setMessage, error }) => {
  if (message === null || message === '') {
    return null
  }

  setTimeout(() => {
    setMessage(null)
  }, 5000)

  return (
    <div className={error ? 'error' : 'success'}>
      {message}
    </div>
  )
}

export default Notification