<template>
  <LayoutHeader :links :name="title ?? info.title" :with-emoji="info.withEmoji" :description="info.description"
    :messages :header-color="headerColor" :emojis="info.emojis" :options="info.options" />
  <main class="container md:p-16 md:pt-4">
    <slot />
  </main>
  <LayoutFooter />
</template>

<script setup lang="ts">
import { isBirthday } from '~/utils';

const appConfig = useAppConfig()
const { messages, title, color, withEmoji } = storeToRefs(layoutStore());

const links = [{
  path: '/',
  name: 'About'
}, {
  path: '/work',
  name: 'Projects'
}, {
  path: '/blog',
  name: 'Articles'
}]

const headerColor = color
const info = computed(() => ({
  title: appConfig.information?.title,
  description: appConfig.information?.description,
  withEmoji: withEmoji.value,
  options: {
    github: appConfig.information?.socials?.github,
    linkedin: appConfig.information?.socials?.linkedin,
    isBirthday: appConfig.information?.birthdate ? isBirthday(appConfig.information?.birthdate) : false,
  }, emojis: {
    normal: appConfig.ui?.icons?.normal as string[] ?? [],
    birthday: appConfig.ui?.icons?.birthday as string[] ?? [],
  }
}));

export type LayoutHeaderProps = typeof info.value
</script>

<style>
.container {
  --uno: px-4 mx-auto border-0 font-serif max-w-[600px] box-border flex-grow-1 flex-shrink-0;
}
</style>