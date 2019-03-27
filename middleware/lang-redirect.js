/*eslint-disable */

export default ({ env: { app }, route, redirect }) => {
  const { defaultLang } = app

  if (!route) {
    return
  }

  if (route.name === 'index') {
    redirect(`/${defaultLang}`)
  }
  if (route.params.lang && route.params.lang.length !== 2) {
    redirect(`/${defaultLang}${route.fullPath}`)
  }
}
