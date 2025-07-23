<template>
  <Silk client-only class="fixed top-0 left-0 w-full h-full -z-1 opacity-5" :scale="1.5" :rotation="1" color="#eeeeee"
    :speed="5" :parallaxStrength="0.10" />
  <LayoutHeader :links :name="title ?? info.title" :with-emoji="info.withEmoji" :description="info.description"
    :messages :header-color="headerColor" :emojis="info.emojis" :options="info.options" :dark-mode="colorMode.value === 'dark'"
    @toggle-dark-mode="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'" />
  <main class="container md:p-16 md:pt-4">
    <slot />
  </main>
  <LayoutFooter />
</template>

<script setup lang="ts">
import { isBirthday } from '~/utils';

const { t } = useI18n()
const appConfig = useAppConfig()
const { messages, title, color, withEmoji } = storeToRefs(layoutStore());

const colorMode = useColorMode()

const links = computed(() => [{
  path: '/',
  name: t('header.about')
}, {
  path: '/projects',
  name: t('header.projects')
}, {
  path: '/articles',
  name: t('header.articles')
}])

const headerColor = color
const info = computed(() => ({
  title: appConfig.information?.title,
  description: appConfig.information?.description,
  withEmoji: withEmoji.value,
  options: {
    github: appConfig.information?.socials?.github,
    linkedin: appConfig.information?.socials?.linkedin,
    isBirthday: appConfig.information?.birthdate ? isBirthday(appConfig.information?.birthdate) : false,
  },
  emojis: {
    normal: appConfig.ui?.icons?.normal as string[] ?? [],
    birthday: appConfig.ui?.icons?.birthday as string[] ?? [],
  }
}));

export type LayoutHeaderProps = typeof info.value

</script>

<style>
.container {
  --uno: px-4 mx-auto border-0 font-serif max-w-[600px] box-border;
  flex: 1;
}
</style>