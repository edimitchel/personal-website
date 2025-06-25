<template>
  <section>
    <ContentRenderer :value="about" class="prose" />
  </section>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

const {messages: storeMessages} = storeToRefs(layoutStore())

const messages = useState('randomIndex', () => appConfig.ui?.messages?.sort(() => Math.random() - 0.5))

if (messages.value) {
    storeMessages.value = messages.value
}

const store = layoutStore();

store.setWithEmoji(true)
store.title = 'Michel Edighoffer'


const about = await useContent('about', () => queryCollection('content').path('/about').first());
</script>
