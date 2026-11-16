import { APIError } from 'better-auth/api'
import { defineServerAuth } from '@nuxtjs/better-auth/config'
import { isAllowedAdminEmail } from '~~/shared/admin/auth'

export default defineServerAuth((ctx) => {
  const adminEmail = String(ctx.runtimeConfig.adminEmail ?? '')
  const extraOrigins = String(ctx.runtimeConfig.authTrustedOrigins ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
  const clientId = String(ctx.runtimeConfig.githubOauth?.clientId ?? '')
  const clientSecret = String(ctx.runtimeConfig.githubOauth?.clientSecret ?? '')
  const github = clientId && clientSecret
    ? { github: { clientId, clientSecret } }
    : undefined

  return {
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
    },
    ...(github ? { socialProviders: github } : {}),
    rateLimit: {
      storage: 'database',
    },
    trustedOrigins: [
      'https://micheledighoffer.fr',
      ...extraOrigins,
    ],
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!isAllowedAdminEmail(String(user.email ?? ''), adminEmail)) {
              throw new APIError('FORBIDDEN', {
                message: 'This account cannot be created.',
              })
            }
            return { data: user }
          },
        },
      },
    },
  }
})
