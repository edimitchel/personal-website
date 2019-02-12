import { requestData } from '../data';

export default async (localizedContent) => {
  const content = await requestData({
    url: `/articlecontent/${localizedContent.id}`,
  });

  localizedContent.contents = content

  return localizedContent
}
