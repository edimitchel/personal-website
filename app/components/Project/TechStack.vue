<template>
  <div class="flex flex-wrap gap-1 group">
    <span 
      v-for="(tech, index) in technologies" 
      :key="tech"
      class="inline-flex items-center px-2 py-1 text-xs bg-primary-300 text-primary-800 rounded font-medium"
      :class="{ 'md:hidden md:group-hover:block': hiddenMoreThan && index >= hiddenMoreThan }"
    >
      <i v-if="getTechIcon(tech)" :class="getTechIcon(tech)" class="w-3 h-3 mr-1" />
      {{ tech }}
    </span>
    <span v-if="hiddenMoreThan && technologies.length > hiddenMoreThan" class="px-2 py-1 text-xs text-primary-800 hidden md:block md:group-hover:hidden">
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
    'jQuery': 'i-logos-jquery',
    'Bootstrap': 'i-logos-bootstrap',
  }
  
  return techIcons[tech] || null
}
</script>
