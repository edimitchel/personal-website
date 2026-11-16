import { isAdminApiPath } from '~~/shared/admin/paths'

export default defineEventHandler(async (event) => {
  if (!isAdminApiPath(event.path)) {
    return
  }
  await requireUserSession(event)
})
