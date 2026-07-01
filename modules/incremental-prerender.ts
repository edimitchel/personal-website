import { join } from 'node:path'
import { defineNuxtModule } from '@nuxt/kit'
import {
  createPrerenderPlan,
  finalizePrerenderManifest,
  logPrerenderPlan,
  restoreCachedRoutes,
  restoreNuxtAssets,
  saveNuxtAssets,
  savePrerenderedRoutes,
  shouldRestoreNuxtAssets,
  type PrerenderPlan,
} from '../scripts/incremental-prerender-lib'

export default defineNuxtModule({
  meta: {
    name: 'incremental-prerender',
  },
  setup(_options, nuxt) {
    const state: { plan: PrerenderPlan | null } = { plan: null }
    const publicDir = () => join(nuxt.options.rootDir, '.output/public')

    nuxt.hook('nitro:init', (nitro) => {
      nitro.hooks.hook('prerender:routes', (routes) => {
        if (shouldRestoreNuxtAssets() && restoreNuxtAssets(publicDir())) {
          console.log('[prerender] restored cached client assets')
        }

        state.plan = createPrerenderPlan({ publicDir: publicDir() })
        logPrerenderPlan(state.plan)
        for (const route of [...routes]) {
          routes.delete(route)
        }
        for (const route of state.plan.routesToPrerender) {
          routes.add(route)
        }
      })

      nitro.hooks.hook('prerender:done', async (result) => {
        const outputDir = publicDir()
        const plan = state.plan ?? createPrerenderPlan({ publicDir: outputDir })
        savePrerenderedRoutes(result.prerenderedRoutes, outputDir, {
          resetManifest: !plan.enabled || plan.shellChanged,
        })
        const restored = restoreCachedRoutes(plan.routesToRestore, outputDir)
        if (restored > 0) {
          console.log(`[prerender] restored ${restored} cached files`)
        }
      })

      nitro.hooks.hook('compiled', () => {
        const outputDir = publicDir()
        saveNuxtAssets(outputDir)
        if (finalizePrerenderManifest(outputDir)) {
          console.log('[prerender] manifest finalized with client asset fingerprint')
        }
      })
    })
  },
})