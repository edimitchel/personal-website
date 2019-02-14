import { requestData } from '../data'

export default async (localizedContent) => {
  const contents = await requestData({
    url: `/localizedcontent/${localizedContent.id}`
  })
  localizedContent.contents = contents.contents
  return localizedContent
}
