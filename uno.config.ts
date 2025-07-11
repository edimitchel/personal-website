import extractorMdc from '@unocss/extractor-mdc'
import { defineConfig, presetIcons, presetTypography, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
    presets: [
        presetWind4(),
        presetIcons(),
        presetTypography(),
    ],
    theme: {
        font: {
            serif: 'Gabarito',
            mono: 'Source Code Pro'
        },
    },
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
    extractors: [
      extractorMdc(),
    ],
    content: {
      filesystem: ['content/**/*.md', 'app/**/*.vue'],
      pipeline: {
        include: [
          /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
          'app/**/*.vue',
        ],
      },
    },
})