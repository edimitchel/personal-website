
import { defineConfig, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
    presets: [
        presetUno()
    ],
    theme: {
        fontFamily: {
            serif: 'Wittgenstein',
            mono: 'Space Mono'
        },
    },
    transformers: [
        transformerDirectives()
    ]
})