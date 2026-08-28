import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  if (!token) {
    return Promise.reject(new Error('Unauthorized: No token provided. Please log in to obtain a valid token.'))
  }

  const request = axios.get(baseUrl, {
    headers: { Authorization: token }
  })

  return request.then(response => response.data)
}

const create = async newObject => {
  if (!token) {
    return Promise.reject(new Error('Unauthorized: No token provided. Please log in to obtain a valid token.'))
  }

  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  if (!token) {
    return Promise.reject(new Error('Unauthorized: No token provided. Please log in to obtain a valid token.'))
  }

  const request = axios.put(`${baseUrl}/${id}`, newObject, {
    headers: { Authorization: token }
  })
  return request.then(response => response.data)
}

const remove = (id) => {
  if (!token) {
    return Promise.reject(new Error('Unauthorized: No token provided. Please log in to obtain a valid token.'))
  }

  const request = axios.delete(`${baseUrl}/${id}`, {
    headers: { Authorization: token }
  })
  return request.then(response => response.data)
}

export default { getAll, create, update, remove, setToken }