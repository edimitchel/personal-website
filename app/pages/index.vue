<template>
  <section>
    <ContentRenderer :value="about" class="prose" />
  </section>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

definePageMeta({ title: 'Michel Edighoffer' })

const store = layoutStore()

const messages = useState('randomIndex', () => appConfig.ui.messages.sort(() => Math.random() - 0.5))

store.messages = messages.value

const { data: about } = await useAsyncData('about', () => queryCollection('content').path('/about').first());
</script>
