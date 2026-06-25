// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
).override('nuxt/vue/rules', {
  rules: {
    'no-multiple-template-root': 'off',
  },
})
