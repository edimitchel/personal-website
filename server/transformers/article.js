import { transform } from './index'

export default (article) => {
  const contents = transform('contents', article.contents)
  const defaultLanguage = article['default-language']

  article.defaultContent = contents.find(
    content => content.language === defaultLanguage
  )
  if (article.defaultContent) {
    delete article['default-language']
    article.options = Object.assign(
      article.options,
      article.defaultContent.options
    )
    delete article.contents
  }

  return article
}
