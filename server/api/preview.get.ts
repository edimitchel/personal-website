import { isSiteAdmin, previewEnabled } from '../utils/site-admin'

export default defineEventHandler((event) => {
  return {
    admin: isSiteAdmin(event),
    enabled: isSiteAdmin(event) && previewEnabled(event),
  }
})
