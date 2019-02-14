import { transform } from './index'

export default async (article) => {
  const localizedContents = await transform('localizedcontents', article.localized_contents)
  article.localized_contents = localizedContents

  return article
}