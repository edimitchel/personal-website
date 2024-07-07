<template>
  <LayoutHeader :links="links" :name="title || info.title" :with-emoji="!!title" :description="info.description"
    :messages="messages" :header-color="headerColor" :emojis="info.emojis" :options="info.references" />
  <main class="container md:p-16 md:pt-8">
    <slot />
  </main>
  <LayoutFooter />
</template>

<script setup lang="ts">
const { messages, title, color } = storeToRefs(layoutStore());

const links = [{
  path: '/',
  name: 'Home'
}, {
  path: '/about',
  name: 'About'
}, {
  path: '/blog',
  name: 'Blog'
}]

const headerColor = color
const info = { title: '', description: '', references: { github: 'editmitchel', twitter: 'edimitchel' }, emojis: { normal: ['🔥'], birthday: [] } }

</script>

<style>
.container {
  --uno: px-4 mx-auto border-0 font-serif max-w-[900px] box-border flex-grow-1;
}
</style>