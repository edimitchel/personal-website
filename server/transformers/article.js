import { transform } from './index'

export default async (article) => {
  const contents = await transform('localizedcontents', article.localized_contents)
  const defaultLanguage = article['default-language']

  article.content = contents.find(
    content => content.language === defaultLanguage
  )
  if (article.content) {
    delete article['default-language']
    article.options = Object.assign(
      article.options,
      article.content.options
    )
  }

  return article
}