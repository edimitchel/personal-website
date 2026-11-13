<template>
  <aside :class="bare ? '' : 'border-default flex min-h-[32rem] flex-col overflow-hidden rounded-lg border bg-transparent'">
    <header
      v-if="!bare"
      class="border-default flex items-center gap-2 border-b px-3 py-2 text-sm"
    >
      <span class="bg-success size-1.5 rounded-full" />
      <span>{{ $t('admin.preview') }}</span>
    </header>
    <div :class="bare ? '' : 'min-h-0 flex-1 overflow-auto px-4 py-6'">
      <div class="prose mx-auto max-w-[600px]">
        <Suspense>
          <Markdown
            :value="rendered"
            :components="components"
            :data="renderData"
          />
          <template #fallback>
            <USkeleton class="h-40 w-full" />
          </template>
        </Suspense>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { useDebounceFn } from '@vueuse/core'
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
import { transformProject } from '~/utils/transformProject'

const props = defineProps<{
  source: string
  bare?: boolean
}>()

const rendered = ref(props.source)
const update = useDebounceFn((value: string) => {
  rendered.value = value
}, 120)

watch(() => props.source, value => update(value))

const components: Record<string, Component> = {
  About,
  'about': About,
  SkillGroup,
  'skill-group': SkillGroup,
  StackGroup,
  'stack-group': StackGroup,
  TechItem,
  'tech-item': TechItem,
  PassionCard,
  'passion-card': PassionCard,
  EnterpriseMission,
  'enterprise-mission': EnterpriseMission,
  EnterpriseVision,
  'enterprise-vision': EnterpriseVision,
  ServiceItem,
  'service-item': ServiceItem,
  ContactForm,
  'contact-form': ContactForm,
}

const projects = await queryCollection('projects')
  .where('type', 'IN', ['consulting', 'experience'])
  .order('completedAt', 'DESC')
  .all()
  .catch(() => [])

const renderData = {
  experiences: projects.map(project => transformProject(project)),
}
</script>
