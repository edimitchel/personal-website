<template>
  <LayoutHeader :links :name="title ?? info.title" :with-emoji="!!title" :description="info.description"
    :messages :header-color="headerColor" :emojis="info.emojis" :options="info.references" />
  <main class="container md:p-16 md:pt-4">
    <slot />
  </main>
  <LayoutFooter />
</template>

<script setup lang="ts">
import { isBirthday } from '~/utils';

const { messages, title, color } = storeToRefs(layoutStore());
const appConfig = useAppConfig()


const links = [{
  path: '/',
  name: 'About'
}, {
  path: '/work',
  name: 'Work'
}, {
  path: '/blog',
  name: 'Blog'
}]

const headerColor = color
const info = {
  title: appConfig.information?.title,
  description: appConfig.information?.description,
  references: {
    github: appConfig.information?.socials?.github,
    linkedin: appConfig.information?.socials?.linkedin,
    isBirthday: appConfig.information?.birthdate ? isBirthday(appConfig.information?.birthdate) : false,
  }, emojis: {
    normal: appConfig.ui?.icons?.normal as string[] ?? [],
    birthday: appConfig.ui?.icons?.birthday as string[] ?? [],
  }
}

</script>

<style>
.container {
  --uno: px-4 mx-auto border-0 font-serif max-w-[900px] box-border flex-grow-1 flex-shrink-0;
}
</style>