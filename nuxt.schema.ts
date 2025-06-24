import { field, group } from "@nuxt/content/preview";
import { z } from "zod";

const schema = {
    title: z.string(),
    description: z.string(),
    icon: z.string(),
    fields: z.object({
        title: z.string(),
        description: z.string(),
        github: z.string(),
        twitter: z.string(),
        birthdate: z.string(),
    })
}

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
                            icon: 'i-mdi-github',
                            default: ''
                        }),
                        twitter: field({
                            type: 'string',
                            title: 'Twitter / X account',
                            description: '',
                            icon: 'i-mdi-x-twitter',
                            default: '',
                            hidden: true
                        }),
                        linkedin: field({
                            type: 'string',
                            title: 'LinkedIn account',
                            description: '',
                            icon: 'i-mdi-linkedin',
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
            }
        }),

        ui: group({
            title: 'UI',
            description: 'Visual stuff of the website',
            icon: 'i-mdi-drawing-box',
            fields: {
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
            }
        })
    }
})