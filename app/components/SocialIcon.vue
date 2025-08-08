<template>
  <div class="social-icon">
    <NuxtLink :to="url" target="_blank" :class="iconClass" :aria-label="platform"></NuxtLink>
  </div>
</template>

<script setup lang="ts">
interface Props {
  platform: 'linkedin' | 'github' | 'twitter' | 'youtube'
  username: string
}

const props = defineProps<Props>()

const platformConfig = {
  linkedin: {
    baseUrl: 'https://linkedin.com/in/',
    iconClass: 'i-line-md:linkedin'
  },
  github: {
    baseUrl: 'https://github.com/',
    iconClass: 'i-line-md:github'
  },
  twitter: {
    baseUrl: 'https://x.com/',
    iconClass: 'i-line-md:twitter-x'
  },
  youtube: {
    baseUrl: 'https://youtube.com/@',
    iconClass: 'i-line-md:youtube'
  },
}

const url = computed(() => {
  const config = platformConfig[props.platform]
  return config.baseUrl + props.username
})

const iconClass = computed(() => {
  return platformConfig[props.platform].iconClass
})
</script>

<style scoped>
.social-icon {
  --uno: w-6 h-6 flex items-center text-center rounded-full 
  transition(ease duration-200 all) 
  bg-foreground bg-opacity-50 backdrop-blur-sm
  hover:(bg-primary-600 scale-125 z-200 text-foreground bg-opacity-100)
}

.social-icon a {
  --uno: w-full h-full m-1;
}
.social-icon:where(a:hover),
.social-icon:where(a:focus-visible) {
  --uno: border(primary-200 1px solid) bg-opacity-100;
}
</style>
