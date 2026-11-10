<template>
  <div class="social-icon">
    <NuxtLink :to="url" target="_blank" :aria-label="platform">
      <UIcon :name="iconClass" class="size-full" />
    </NuxtLink>
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
    iconClass: 'i-line-md-linkedin'
  },
  github: {
    baseUrl: 'https://github.com/',
    iconClass: 'i-line-md-github'
  },
  twitter: {
    baseUrl: 'https://x.com/',
    iconClass: 'i-line-md-twitter-x'
  },
  youtube: {
    baseUrl: 'https://youtube.com/@',
    iconClass: 'i-line-md-youtube'
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
@reference "../assets/css/main.css";

.social-icon {
  @apply w-6 h-6 flex items-center text-center rounded-full transition-all duration-200 ease-out bg-paper/50 backdrop-blur-sm hover:bg-tone-600 hover:scale-125 hover:z-[200] hover:text-paper;
}

.social-icon a {
  @apply w-full h-full m-1;
}

.social-icon:where(a:hover),
.social-icon:where(a:focus-visible) {
  @apply border border-solid border-tone-200;
}
</style>
