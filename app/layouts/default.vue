<template>
  <LayoutHeader :links="links" :name="title || info.title" :with-emoji="!!title" :description="info.description"
    :messages="messages" :header-color="headerColor" :emojis="info.emojis" :options="info.references" />
  <main class="container mx-auto">
    <NuxtPage v-if="!$slots.default" />
    <slot />
  </main>
  <LayoutFooter />
</template>

<script setup lang="ts">
const { messages, title } = storeToRefs(layoutStore());

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

const headerColor = ''
const info = { title: '', description: '', references: { github: 'editmitchel' }, emojis: { normal: ['🔥'], birthday: [] } }

</script>

<style>
.container {
  --uno: px-4 border-0 mx-auto font-sans;
}

@screen md {
  .container {
    --uno: p-16 pt-8;
  }
}

.fade-enter-active,
.fade-leave-active,
.appear {
  transition: all 200ms ease;
  position: relative;
  top: 0;
}

.fade-enter-to {
  transition-delay: 150ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  top: -5px;
}

.up-enter-active,
.up-leave-active,
.appear {
  transition: opacity 300ms ease, transform 400ms ease;
  position: relative;
  transform: translateY(0);
}

.up-leave-to {
  transition-delay: 200ms;
}

.up-enter-from,
.up-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  z-index: -1;
}
</style>