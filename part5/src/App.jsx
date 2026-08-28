import React from 'react'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

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

  /*useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])*/

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      ) //we want see the blogs only if the user is logged in, so we moved the getAll() call inside the if statement
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
        'wrong username or password'
      )
      setTimeout(() => {
        setError(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    setUser(null)
    blogService.setToken(null)
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

  const handleLike = async (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id)

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user?.id || blogToUpdate.user?._id || blogToUpdate.user
    }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    } catch (error) {
      console.error('Error updating blog:', error)
      setError(true)
      setMessage(`Something went wrong: ${error}`)
      setTimeout(() => setError(false), 5000)
    }
  }

  const handleDelete = async (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)

    if (window.confirm(`Are you sure you want to delete ${blogToDelete.title} by ${blogToDelete.author}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setMessage(`${blogToDelete.title} by ${blogToDelete.author} deleted`)
      } catch (error) {
        console.error('Error deleting blog:', error)
        setError(true)
        setMessage(
          `Something went wrong: ${error}`
        )
        setTimeout(() => {
          setError(false)
        }, 5000)
      }
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
    </form>
  )

  return (
    <div>
      <Notification message={message} setMessage={setMessage} error={error}/>
      {!user && loginForm()}

      {user && <><p>{user.name} logged in</p><button onClick={() => handleLogout()}>logout</button></>}
      {user && <Togglable buttonLabel="create blog" hideLabel="cancel">
        <h2>Blogs</h2>
        <BlogForm
          handleBlogSubmit={handleBlogSubmit}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          url={url}
          setUrl={setUrl}
        />
      </Togglable>
      }
      {user && blogs.sort((a, b) => a.likes - b.likes).map(blog =>
        <React.Fragment key={blog.id}>
          <Blog blog={blog} />
          <Togglable buttonLabel="view" hideLabel="hide">
            url: {blog.url} <br />
            {blog.likes} likes <button onClick={() => handleLike(blog.id)}>like</button><br />
            author: {blog.author} <br />
            {(blog.user?.id === user.id || blog.user === user.id) &&
            <button  onClick={() => handleDelete(blog.id)}>remove</button>}
          </Togglable>
        </React.Fragment>
      )}
    </div>
  )
}

export default App