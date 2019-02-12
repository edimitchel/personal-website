import axios from 'axios'

import endpoints from './endpoints'
import { transform } from './transformers'

const Axios = axios.create({
  baseURL: process.env.API_URL
})

const request = async ({ url, method = 'GET' }) => {
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

export const requestData = async (req) => {
  const result = await request(req)
  if (result !== null) {
    try {
      return transformData(result)
    } catch (e) {
      return Promise.reject(e)
    }
  }
}

const handler = (req, res, next) => {
  requestData(req)
    .then((data) => {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(data))
    })
    .catch(next)
}

export default { path: '/api', handler: handler }
