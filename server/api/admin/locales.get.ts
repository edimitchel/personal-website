import { isContentCollection } from '~~/shared/admin/collections'
import { isFileStem } from '~~/shared/admin/locales'
import { getLocales } from '../../utils/content-locales'
import { translationSetup } from '../../utils/translation'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const collection = String(query.collection ?? '')
  const fileStem = String(query.stem ?? '')
  if (!isContentCollection(collection) || !isFileStem(fileStem)) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }
  const locales = await getLocales(collection, fileStem)
  const setup = translationSetup()
  return {
    ...locales,
    translationReady: Boolean(setup.apiKey && setup.baseURL && setup.model),
  }
})
