<template>
  <div class="contents">
    <ClientOnly>
      <Background />
    </ClientOnly>
    <LayoutHeader
      :links
      :with-emoji="info.withEmoji"
      :description="info.description"
      :messages
      :header-color="headerColor"
      :emojis="info.emojis"
      :options="info.options"
    />
    <main class="container md:p-16 md:pt-4">
      <div id="modals" />
      <div
        v-if="markdown"
        class="prose text-ink"
      >
        <Suspense>
          <Markdown
            :value="markdown"
            :components="previewComponents"
          />
        </Suspense>
      </div>
      <div v-show="!markdown">
      <slot />
    </div>
    </main>
    <SitePreviewToggle />
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
import { Markdown } from '@comark/vue'
import About from '~/components/content/About.vue'
import SkillGroup from '~/components/content/SkillGroup.vue'
import StackGroup from '~/components/content/StackGroup.vue'
import TechItem from '~/components/content/TechItem.vue'
import PassionCard from '~/components/content/PassionCard.vue'
import EnterpriseMission from '~/components/content/EnterpriseMission.vue'
import EnterpriseVision from '~/components/content/EnterpriseVision.vue'
import ServiceItem from '~/components/content/ServiceItem.vue'
import ContactForm from '~/components/ContactForm.vue'
import { isBirthday } from '~/utils'

const { t } = useI18n()
const { markdown } = useSitePreview()
const previewComponents = {
  'About': About,
  'about': About,
  'SkillGroup': SkillGroup,
  'skill-group': SkillGroup,
  'StackGroup': StackGroup,
  'stack-group': StackGroup,
  'TechItem': TechItem,
  'tech-item': TechItem,
  'PassionCard': PassionCard,
  'passion-card': PassionCard,
  'EnterpriseMission': EnterpriseMission,
  'enterprise-mission': EnterpriseMission,
  'EnterpriseVision': EnterpriseVision,
  'enterprise-vision': EnterpriseVision,
  'ServiceItem': ServiceItem,
  'service-item': ServiceItem,
  'ContactForm': ContactForm,
  'contact-form': ContactForm,
}
const appConfig = useAppConfig()
const { messages, color, withEmoji } = storeToRefs(layoutStore())

const links = computed(() => [{
  path: '/',
  name: t('header.about'),
}, {
  path: '/projects',
  name: t('header.projects'),
}, {
  path: '/articles',
  name: t('header.articles'),
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
    normal: appConfig.information?.icons?.normal ?? [],
    birthday: appConfig.information?.icons?.birthday ?? [],
  },
}))

export type LayoutHeaderProps = typeof info.value
</script>

<style scoped>
@reference "../assets/css/main.css";

.container {
  @apply px-4 mx-auto border-0 font-serif max-w-[600px] box-border;
  flex: 1;
}
</style>
