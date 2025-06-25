import { defineConfig, presetIcons, presetTypography, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'
import colors from 'windicss/colors'

export default defineConfig({
    presets: [
        presetWind4(),
        presetIcons(),
        presetTypography(),
    ],
    preflights: [
        {
            getCSS: () => `
                .prose {
                    max-width: none !important;
                }
            `
        }
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
    ]
})