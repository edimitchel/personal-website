import { requestData } from '../data';

export default async (localizedContent) => {
  const contents = await requestData({
    url: `/articlecontent/${localizedContent.id}`,
  });

  localizedContent.contents = contents

  return localizedContent
}
