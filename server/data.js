import axios from 'axios'

import endpoints from './endpoints'
import { transform } from './transformers'

const Axios = axios.create({
  baseURL: process.env.API_URL
})

const request = async ({ url, method }) => {
  const { resource, endpoint } = endpoints.match(url)

  const { data } = await Axios.request(endpoint, {
    method: method.toLowerCase()
    // add axios more request config here
  })

  return { resource, data }
}

const transformData = ({ resource, data }) => {
  if (!data) {
    throw new Error('No data')
  }

  return transform(resource, data)
}

const handleRequest = async (req) => {
  const result = await request(req)
  if (result !== null) {
    try {
      return Promise.resolve(transformData(result))
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

const handler = (req, res, next) => {
  handleRequest(req)
    .then((data) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    })
    .catch(next)
}

module.exports = { path: '/api', handler: handler }
