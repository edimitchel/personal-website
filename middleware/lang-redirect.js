/*eslint-disable */

export default ({ env: { info }, route, redirect }) => {
  const { defaultLang } = info

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
