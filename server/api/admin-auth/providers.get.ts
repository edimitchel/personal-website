export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const clientId = String(config.githubOauth?.clientId ?? '')
  const clientSecret = String(config.githubOauth?.clientSecret ?? '')
  return { github: Boolean(clientId && clientSecret) }
})
