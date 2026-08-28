const blogForm = (props) => (
    <div>
      <form onSubmit={props.handleBlogSubmit}>
        <h2>Create new</h2>
        <label>
          title:
          <input value={props.title} onChange={({ target }) => props.setTitle(target.value)} />
        </label>
        <label>
          author:
          <input value={props.author} onChange={({ target }) => props.setAuthor(target.value)} />
        </label>
        <label>
          url:
          <input value={props.url} onChange={({ target }) => props.setUrl(target.value)}  />
        </label>
        <button type="submit">create</button>
      </form>
    </div>
  )

  export default blogForm