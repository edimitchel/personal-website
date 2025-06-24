import type AppConfig from "../nuxt.schema";

export default defineAppConfig({
  ui: {
    icons: {
      normal: ["👋", "🖖"],
      birthday: ["🎂"]
    },
    messages: [
      'full-stack engineer',
      'tech leader',
      'Vue & Nuxt expert',
      'I hope in Source',
      'Alsace ❤',
    ]
  },

  information: {
    title: "Michel Edighoffer",
    description: "",
    socials: {
      github: "edimitchel",
      linkedin: "michel-edighoffer",
      youtube: "MichelEdighoffer",
      twitter: "edimitchel",
      birthdate: '1993-02-28'
    },
  }
} satisfies typeof AppConfig)