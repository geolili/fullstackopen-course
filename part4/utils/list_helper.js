const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))

  return blogs
    .filter(blog => blog.likes === maxLikes)
    .map(blog => ({
      title: blog.title
    }))
}

const mostBlogs = (blogs) => {
  const authorBlogs = _.countBy(blogs, 'author')
  const authorPairs = _.toPairs(authorBlogs)
  const most = _.maxBy(authorPairs, (pair) => pair[1])
  return {
    author: most[0],
    blogs: most[1]
  }
}

const mostLikes = (blogs) => {
  const authorLikes = _.groupBy(blogs, 'author')
  const authors = _.map(authorLikes, (authorBlogs, authorName) => {
    return {
      author: authorName,
      likes: _.sumBy(authorBlogs, 'likes')
    }
  })
  const most = _.maxBy(authors, 'likes')
  return most
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}