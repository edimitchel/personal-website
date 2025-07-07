<template>
  <section>
    <ContentRenderer v-if="about" :value="about" class="prose" />
  </section>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const { locale } = useI18n()

const { messages: storeMessages } = storeToRefs(layoutStore())

const messages = useState('randomIndex', () => appConfig.ui?.messages?.sort(() => Math.random() - 0.5))

if (messages.value) {
  storeMessages.value = messages.value
}

const store = layoutStore();

store.title = 'Michel Edighoffer'

const about = await useContent('about-' + locale.value, () => queryCollection('content').path(`${locale.value === "fr" ? '/fr' : ''}/about`).first());
</script>
