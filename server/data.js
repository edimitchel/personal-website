import axios from 'axios'

import endpoints from './endpoints'
import { transform } from './transformers'

const Axios = axios.create({
  baseURL: process.env.API_URL
})

const cache = new Map();

const request = async ({ url, method }) => {
  const { resource, endpoint, method: m } = endpoints.match(url, method)
  const { data } = await Axios.request(endpoint, {
    method: m.toLowerCase()
    // add more axios request config here
  })

  return { resource, data }
}

const transformData = async ({ resource, data }) => {
  if (!data) {
    throw new Error('No data')
  }

  return await transform(resource, data)
}

export const requestData = async (req) => {
  if(req.method === 'GET' && cache.has(req.url.replace('/', '-'))) {
    return Promise.resolve(cache.get(req.url.replace('/', '-')));
  }
  const result = await request(req)
  if (result !== null) {
    try {
      const transformed = transformData(result)
      cache.set(req.url.replace('/', '-'), transformed)
      return Promise.resolve(transformed)
    } catch (e) {
      return Promise.reject(e)
    }
  }
  return Promise.reject(new Error('No result data'))
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
