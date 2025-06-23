<template>
  <LayoutHeader :links="links" :name="title ?? info.title" :with-emoji="!!title" :description="info.description"
    :messages="messages" :header-color="headerColor" :emojis="info.emojis" :options="info.references" />
  <main class="container md:p-16 md:pt-8">
    <slot />
  </main>
  <LayoutFooter />
</template>

<script setup lang="ts">
const { messages, title, color } = storeToRefs(layoutStore());
const appConfig = useAppConfig()

const links = [{
  path: '/',
  name: 'Home'
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
    github: appConfig.information?.github,
    linkedin: appConfig.information?.linkedin
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