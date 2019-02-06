const endpoints = {
  articles: 'articles',
  article: id => `articles/${id}`,
  comments: articleId => `articles/${articleId}/comments`,
  comment: commentId => `comments/${commentId}`
}

const match = (url) => {
  const resource = url.match(/^\/?([a-zA-Z-]+)/)[1]
  const params = url.replace(resource, '').split('/').filter(p => p)
  if (resource) {
    const endpoint = endpoints[resource]
    if (endpoint instanceof Function) {
      return { resource, endpoint: endpoint.apply(params) }
    } else {
      return { resource, endpoint }
    }
  }
  throw new Error('No endpoint found')
}

export default {
  match
}
