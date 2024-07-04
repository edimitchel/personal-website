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
const info = { title: '', description: '', references: { github: 'editmitchel' }, emojis: { normal: ['🔥'], birthday: [] } }

</script>

<style>
.container {
  --uno: px-4 mx-auto border-0 font-serif max-w-[900px] box-border flex-grow-1;
}

.fade-enter-active,
.fade-leave-active,
.appear {
  transition: all 300ms ease;
  position: relative;
  top: 0;
}

.fade-enter-to {
  transition-delay: 300ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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