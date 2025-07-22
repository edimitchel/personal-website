import { defineConfig, presetIcons, presetTypography, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
    presets: [
        presetWind4({
            preflights: {
                reset: true,
            }
        }),
        presetIcons(),
        presetTypography(),
    ],
    theme: {
        colors: {
            // Set gray as primary color with full palette
            primary: {
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937',
                900: '#111827',
                950: '#030712',
                DEFAULT: '#6b7280', // gray-500 as default primary
            },
            // Ensure all gray shades are available
            gray: {
                50: '#f9fafb',
                100: '#f3f4f6',
                200: '#e5e7eb',
                300: '#d1d5db',
                400: '#9ca3af',
                500: '#6b7280',
                600: '#4b5563',
                700: '#374151',
                800: '#1f2937',
                900: '#111827',
                950: '#030712',
            },
            // Keep other essential colors
            white: '#ffffff',
            black: '#000000',
            transparent: 'transparent',
            current: 'currentColor',
        },
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