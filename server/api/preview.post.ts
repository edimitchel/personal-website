import { z } from 'zod'
import { isSiteAdmin } from '../utils/site-admin'

const bodySchema = z.object({
  enabled: z.boolean(),
})

export default defineEventHandler(async (event) => {
  if (!isSiteAdmin(event)) {
    throw createError({ statusCode: 401, statusMessage: 'admin' })
  }
  const parsed = await readValidatedBody(event, bodySchema.safeParse)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'preview' })
  }
  setCookie(event, 'site-preview', parsed.data.enabled ? '1' : '0', {
    path: '/',
    sameSite: 'lax',
    httpOnly: false,
  })
  return { enabled: parsed.data.enabled }
})
