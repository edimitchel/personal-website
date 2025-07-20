<template>
  <div class="flex flex-wrap gap-2">
    <span 
      v-for="tech in technologies" 
      :key="tech"
      class="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium"
    >
      <i v-if="getTechIcon(tech)" :class="getTechIcon(tech)" class="w-3 h-3 mr-1" />
      {{ tech }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  technologies: string[]
}

defineProps<Props>()

function getTechIcon(tech: string): string | null {
  const techIcons: Record<string, string> = {
    'React': 'i-logos-react',
    'Vue': 'i-logos-vue',
    'JavaScript': 'i-logos-javascript',
    'TypeScript': 'i-logos-typescript-icon',
    'PHP': 'i-logos-php',
    'Python': 'i-logos-python',
    'Node.js': 'i-logos-nodejs-icon',
    'HTML': 'i-logos-html-5',
    'CSS': 'i-logos-css-3',
    'Nuxt': 'i-logos-nuxt-icon',
    'Next.js': 'i-logos-nextjs-icon',
    'Tailwind': 'i-logos-tailwindcss-icon',
    'Docker': 'i-logos-docker-icon',
    'Git': 'i-logos-git-icon',
    'MySQL': 'i-logos-mysql',
    'PostgreSQL': 'i-logos-postgresql',
    'MongoDB': 'i-logos-mongodb-icon',
    'Redis': 'i-logos-redis',
    'AWS': 'i-logos-aws',
    'Firebase': 'i-logos-firebase',
    'Vercel': 'i-logos-vercel-icon',
    'Netlify': 'i-logos-netlify',
  }
  
  return techIcons[tech] || null
}
</script>
