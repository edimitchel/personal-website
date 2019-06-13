import story from './story'
import vision from './vision'
import type from './type'

let contextStatic = {};

const transformers = {
  story,
  vision,
  type,
}

const getTransformer = (dataType) => {
  return dataType in transformers ? transformers[dataType] : null
}

const transformFn = (t, c = {}) => data => data ? Promise.resolve(t.apply(this, [data, c])) : {}

export const transform = (type, data, context = contextStatic) => {
  const transformer = getTransformer(type)
  contextStatic = context;
  if (transformer === null) {
    return data
  }
  if (Array.isArray(data)) {
    return Promise.all(data.map(transformFn(transformer, context)))
  } else {
    return transformFn(transformer, context)(data)
  }
}
