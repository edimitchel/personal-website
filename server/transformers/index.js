import article from './article'
import content from './content'
import localizedcontent from './localizedcontent'

const transformers = {
  articles: article,
  contents: content,
  localizedcontents: localizedcontent,
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
  if (Array.isArray(data)) return Promise.all(data.map(transformFn(transformer)));

  return transformFn(transformer)(data) 
}