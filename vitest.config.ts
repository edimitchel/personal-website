import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    // you can optionally set nuxt-specific environment options
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
        overrides: {
          // other nuxt config you want to pass
        }
      }
    }
  }
})
