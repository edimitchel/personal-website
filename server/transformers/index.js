import story from './story'

const transformers = {
  story
}

const getTransformer = (dataType) => {
  return dataType in transformers ? transformers[dataType] : null
}

const transformFn = transformer => data => Promise.resolve(transformer(data))

export const transform = (type, data) => {
  const transformer = getTransformer(type)
  if (transformer === null) {
    return data
  }
  if (Array.isArray(data)) return Promise.all(data.map(transformFn(transformer)))

  return transformFn(transformer)(data)
}
