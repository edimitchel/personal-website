
import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons(),
    ],
    theme: {
        fontFamily: {
            serif: 'Wittgenstein',
            mono: 'Source Code Pro'
        },
    },
    transformers: [
        transformerDirectives()
    ]
})