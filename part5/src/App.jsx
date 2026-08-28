import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
        setError(true)
        setMessage(
        `wrong username or password`
      )
      setTimeout(() => {
        setError(false)
      }, 5000)
    }  
}

const handleLogout = () => {
  window.localStorage.removeItem('loggedNoteappUser')
  setUser(null)
}

const handleBlogSubmit = async (event) => {
  event.preventDefault()

  try {
    const newBlog = await blogService.create({ title, author, url })
    setBlogs(blogs.concat(newBlog))
    setTitle('')
    setAuthor('')
    setUrl('')
    setMessage(`${title} by ${author} added`)
  } catch (error) {
    console.error('Error creating blog:', error)
    setError(true)
    setMessage(
      `Something went wrong: ${error}`
    )
    setTimeout(() => {
      setError(false)
    }, 5000)
  }
}

const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
      <Notification message={message} setMessage={setMessage} error={error}/>
    </form>
  )

  const blogForm = () => (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} setMessage={setMessage} error={error}/>
      <p>{user.name} logged in</p>
      <button onClick={() => handleLogout()}>logout</button>
      <form onSubmit={handleBlogSubmit}>
        <h2>Create new</h2>
        <label>
          title:
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </label>
        <label>
          author:
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </label>
        <label>
          url:
          <input value={url} onChange={({ target }) => setUrl(target.value)}  />
        </label>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App