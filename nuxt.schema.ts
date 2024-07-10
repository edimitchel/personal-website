import { field, group } from "@nuxthq/studio/theme";

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
                github: field({
                    type: 'string',
                    title: 'Github account',
                    description: '',
                    icon: 'i-mdi-text',
                    default: ''
                }),
                twitter: field({
                    type: 'string',
                    title: 'Twitter / X account',
                    description: '',
                    icon: 'i-mdi-text',
                    default: ''
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