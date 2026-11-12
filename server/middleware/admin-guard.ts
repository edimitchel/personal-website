import { isAdminPath } from '~~/shared/admin/paths'

export default defineEventHandler((event) => {
  if (!isAdminPath(event.path)) {
    return
  }

  // Local editing stays open. Elsewhere, an anonymous request is refused.
  // The JWT itself is checked in the auth step, not here.
  if (import.meta.dev) {
    return
  }

  const assertion = getRequestHeader(event, 'cf-access-jwt-assertion')
  if (!assertion) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Admin requires Cloudflare Access',
    })
  }
})
