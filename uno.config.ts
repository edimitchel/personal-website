import { defineConfig, presetIcons, presetTypography, presetWind4, transformerDirectives } from 'unocss'

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
            serif: 'Wittgenstein',
            mono: 'Source Code Pro'
        },
        colors: {
            primary: '#000',
            secondary: '#fff',
            gray: '#ccc',
            
        },
    },
    transformers: [
        transformerDirectives()
    ]
})