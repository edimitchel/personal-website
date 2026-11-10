import { field, group } from "@nuxt/content/preview";

// Nuxt injects this global when it loads the schema file. The app TS project
// does not see that global, so declare it here. The identity return keeps
// `typeof` of this file precise for app.config.ts.
declare const defineNuxtSchema: <T>(schema: T) => T

export default defineNuxtSchema({
    appConfig: {
        information: group({
            title: 'Website information',
            description: 'Information of the website',
            icon: 'i-mdi-earth',
            fields: {
                title: field({
                    type: 'string',
                    title: 'Title of the website',
                    description: '',
                    icon: 'i-mdi-text-short',
                    default: ''
                }),
                description: field({
                    type: 'string',
                    title: 'Description of the website',
                    description: '',
                    icon: 'i-mdi-text',
                    default: ''
                }),
                socials: group({
                    title: 'Socials',
                    description: 'Socials of the website',
                    icon: 'i-mdi-earth',
                    fields: {
                        github: field({
                            type: 'string',
                            title: 'Github account',
                            description: '',
                            icon: 'i-line-md:github',
                            default: ''
                        }),
                        twitter: field({
                            type: 'string',
                            title: 'Twitter / X account',
                            description: '',
                            icon: 'i-line-md:twitter-x',
                            default: '',
                            hidden: true
                        }),
                        youtube: field({
                            type: 'string',
                            title: 'Youtube account',
                            description: '',
                            icon: 'i-line-md:youtube',
                            default: '',
                            hidden: true
                        }),
                        linkedin: field({
                            type: 'string',
                            title: 'LinkedIn account',
                            description: '',
                            icon: 'i-line-md:linkedin',
                            default: ''
                        }),
                    }
                }),
                birthdate: field({
                    type: 'string',
                    title: 'Birthdate',
                    description: 'format: YYYY-MM-DD',
                    icon: 'i-mdi-calendar-blank',
                    default: '',
                }),
                icons: group({
                    description: 'Icons used between full name',
                    title: 'Icons',
                    icon: 'i-mdi-image-filter-vintage',
                    fields: {
                        normal: field({
                            type: 'array',
                            title: 'Normal icons',
                            default: [],
                        }),
                        birthday: field({
                            type: 'array',
                            title: 'Birthday icons',
                            default: [],
                        }),
                    }
                }),
                messages: field({
                    type: 'array',
                    title: 'Messages',
                    description: 'Messages displayed on the home page',
                    icon: 'i-mdi-message',
                    default: [],
                }),
            }
        }),

        ui: group({
            title: 'UI',
            description: 'Visual stuff of the website',
            icon: 'i-mdi-drawing-box',
            fields: {
                colors: group({
                    title: 'Nuxt UI colors',
                    description: 'Semantic aliases. primary and neutral stay on Tailwind gray.',
                    icon: 'i-mdi-palette',
                    fields: {
                        primary: field({
                            type: 'string',
                            title: 'Primary',
                            default: 'gray',
                        }),
                        neutral: field({
                            type: 'string',
                            title: 'Neutral',
                            default: 'gray',
                        }),
                    },
                }),
            }
        })
    }
})