import { defineConfig, presetIcons, presetTypography, presetWind4, PresetWindTheme, ThemeExtender, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetTheme } from 'unocss-preset-theme'

export default defineConfig({
    presets: [
        presetWind4({
            preflights: {
                reset: true,
                theme: true, 
            }
        }),
        presetIcons(),
        presetTypography(),
        presetTheme<PresetWindTheme>({
            selectors: { light: ':root', dark: '.dark-mode' },
            theme: {
                dark: {
                    colors: {
                        primary: {
                            50: '#030712',
                            100: '#111827',
                            200: '#1f2937',
                            300: '#374151',
                            400: '#4b5563',
                            500: '#6b7280',
                            600: '#9ca3af',
                            700: '#d1d5db',
                            800: '#e5e7eb',
                            900: '#f3f4f6',
                            950: '#f9fafb',
                            DEFAULT: '#6b7280',
                        },
                        forground: '#333333',
                        background: '#ffffff',
                    },
                },
            },
        }),
    ],
    theme: {
        colors: {
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
                DEFAULT: '#6b7280',
            },
            forground: '#ffffff',
            background: '#000000',
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