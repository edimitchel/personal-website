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
        }
      })
    }
  })