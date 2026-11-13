import { isSiteAdmin, previewEnabled } from '../utils/site-admin'

export default defineEventHandler(async (event) => {
  const admin = await isSiteAdmin(event)
  return {
    admin,
    enabled: admin && previewEnabled(event),
  }
})
