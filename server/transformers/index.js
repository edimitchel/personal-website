import story from './story'
import vision from './vision'

const transformers = {
  story,
  vision,
}

const getTransformer = (dataType) => {
  return dataType in transformers ? transformers[dataType] : null
}

const transformFn = t => data => data ? Promise.resolve(t(data)) : {}

export const transform = (type, data) => {
  const transformer = getTransformer(type)
  if (transformer === null) {
    return data
  }

  if (Array.isArray(data)) {
    return Promise.all(data.map(transformFn(transformer)))
  } else {
    return transformFn(transformer)(data)
  }
}
