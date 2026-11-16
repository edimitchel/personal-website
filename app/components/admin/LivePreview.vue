<template>
  <section :class="bare ? '' : 'admin-col'">
    <header
      v-if="!bare"
      class="admin-col-head"
    >
      <span>{{ $t('admin.preview') }}</span>
    </header>
    <div :class="bare ? '' : 'admin-col-scroll admin-col-pad'">
      <div
        class="admin-preview prose max-w-[600px]"
        :class="bare ? '' : 'mx-auto'"
      >
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
  </section>
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
