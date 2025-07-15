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
    ]
})