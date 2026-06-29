<template>
  <div
    class="relative"
    :class="{ 'tech-stack--collapsible': hiddenMoreThan }"
  >
    <div
      class="flex flex-wrap gap-1"
      :class="hiddenMoreThan ? 'tech-stack__tags' : undefined"
    >
      <span
        v-for="tech in technologies"
        :key="tech"
        class="inline-flex items-center px-2 py-1 text-xs bg-primary-300 text-primary-800 rounded font-medium"
      >
        <i
          v-if="getTechIcon(tech)"
          :class="getTechIcon(tech)"
          class="inline-block shrink-0 w-3.5 h-3.5 mr-1"
        />
        {{ tech }}
      </span>
    </div>
    <span
      v-if="hiddenMoreThan && technologies.length > hiddenMoreThan"
      class="tech-stack__more hidden md:block absolute right-0 bottom-0 px-2 py-1 text-xs text-primary-800 pointer-events-none"
    >
      +{{ technologies.length - hiddenMoreThan }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  technologies: string[]
  hiddenMoreThan?: number
}

defineProps<Props>()

function getTechIcon(tech: string): string | null {
  const techIcons: Record<string, string> = {
    'React': 'i-logos-react',
    'Vue': 'i-logos-vue',
    'Angular': 'i-logos-angular-icon',
    'Redux': 'i-logos-redux',
    'Preact': 'i-logos-preact',
    'Vite': 'i-logos-vitejs',
    'PWA': 'i-logos-pwa',
    'JavaScript': 'i-logos-javascript',
    'TypeScript': 'i-logos-typescript-icon',
    'PHP': 'i-logos-php',
    'Python': 'i-logos-python',
    'Node.js': 'i-logos-nodejs-icon',
    'HTML': 'i-logos-html-5',
    'CSS': 'i-logos-css-3',
    'Nuxt': 'i-logos-nuxt-icon',
    'Nitro': 'i-unjs-nitro',
    'Nuxt 3': 'i-logos-nuxt-icon',
    'Nuxt 4': 'i-logos-nuxt-icon',
    'Nuxt UI': 'i-skill-icons-nuxtjs-dark',
    'NestJS': 'i-logos-nestjs',
    'TypeORM': 'i-logos-typeorm',
    'Vitest': 'i-logos-vitest',
    'FullCalendar': 'i-mdi-calendar-month-outline',
    'rrule': 'i-mdi-repeat-variant',
    'Next.js': 'i-logos-nextjs-icon',
    'Tailwind': 'i-logos-tailwindcss-icon',
    'Docker': 'i-logos-docker-icon',
    'Laravel': 'i-logos-laravel',
    'Git': 'i-logos-git-icon',
    'MySQL': 'i-logos-mysql',
    'PostgreSQL': 'i-logos-postgresql',
    'MongoDB': 'i-logos-mongodb-icon',
    'Redis': 'i-logos-redis',
    'AWS': 'i-logos-aws',
    'Firebase': 'i-logos-firebase',
    'Vercel': 'i-logos-vercel-icon',
    'Netlify': 'i-logos-netlify',
    'jQuery': 'i-logos-jquery',
    'Bootstrap': 'i-logos-bootstrap',
    'Service Worker': 'i-logos-pwa',
    'REST API': 'i-mdi-api',
  }

  return techIcons[tech] ?? null
}
</script>

<style scoped>
@media (min-width: 768px) {
  .tech-stack--collapsible .tech-stack__tags {
    max-height: 1.75rem;
    overflow: hidden;
    transition: max-height 350ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .group:hover .tech-stack--collapsible .tech-stack__tags {
    max-height: 6rem;
  }

  .tech-stack__more {
    opacity: 1;
    transition: opacity 250ms ease;
  }

  .group:hover .tech-stack__more {
    opacity: 0;
  }
}
</style>
