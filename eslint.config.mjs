// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).override('vue', {
  rules: {
    'no-multiple-template-root': 'off',
  },
})
