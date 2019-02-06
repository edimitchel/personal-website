import article from './article'

const transformers = {
  articles: article
}

const getTransformer = (dataType) => {
  return dataType in transformers ? transformers[dataType] : null
}

function transform(type, data) {
  const transformer = getTransformer(type)
  if (transformer === null) {
    return data
  }
  if (Array.isArray(data)) return data.map(transformer)

  return transformer(data)
}

export { transform }
