<template>
  <div class="about-container mx-auto min-w-0 max-w-full px-4 py-2">
    <section>
      <div class="flex flex-col lg:flex-row items-center gap-8">
        <div class="profile-info flex-1 text-center">
          <h2 class="text-2xl lg:text-3xl underline decoration-tone-600 mb-4 mt-0">
            {{ title }}
          </h2>
          <p class="text-lg leading-relaxed text-balance">
            {{ description }}
          </p>
        </div>
      </div>
    </section>

    <ContactForm />

    <section class="skills-section my-15">
      <h2 class="text-2xl font-bold my-8 text-center text-ink">
        {{ $t('skills_n_expertise') }}
      </h2>
      <div class="grid min-w-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <SpotlightCard spotlight-color="#f4f4f4" v-for="(skillCategory, index) in skills" :key="skillCategory.category"
          class="skill-category min-w-0 bg-paper rounded-lg p-6 shadow-sm shadow-tone/40 transition-shadow"
          :class="{ 'md:col-span-2': index % 2 === 0 && index === skills.length - 1 }">
          <h4 class="text-xl font-semibold m-0 mb-4 text-ink flex min-w-0 items-center">
            <span class="text-2xl mr-2 shrink-0">
              <UIcon v-if="skillCategory.iconName" :name="skillCategory.iconName" />
              <template v-else>{{ skillCategory.icon }}</template>
            </span>
            <span class="min-w-0">{{ skillCategory.category }}</span>
          </h4>
          <div class="flex min-w-0 max-w-full flex-wrap gap-2">
            <span v-for="skill in skillCategory.items" :key="skill"
              class="max-w-full break-words px-3 py-1 bg-tone-200 text-tone-800 rounded-full text-sm font-medium">
              {{ skill }}
            </span>
          </div>
        </SpotlightCard>
      </div>
    </section>

    <section class="tech-stack-section mb-12">
      <h2 class="text-2xl font-bold my-8 text-center text-ink">
        {{ $t('tech_stack') }}
      </h2>
      <div class="grid min-w-0 grid-cols-1 gap-8">
        <div v-for="stackCategory in techStack" :key="stackCategory.category" class="stack-category min-w-0">
          <h3 class="text-xl font-semibold m-0 mb-4 text-ink">
            {{ stackCategory.category }}
          </h3>
          <div class="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3">
            <div v-for="(tech, index) in stackCategory.technologies" :key="tech.name"
              class="tech-item min-w-0 bg-paper rounded-lg p-4 text-center shadow-sm shadow-tone/40 transition-shadow">

              <div class="mb-2 flex justify-center text-3xl">
                <UIcon :name="tech.iconName" />
              </div>
              <div class="break-words text-sm font-medium text-ink">{{ tech.name }}</div>
              <div class="break-words text-xs text-tone-600">{{ tech.level }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="passions-section mb-12">
      <h2 class="text-2xl font-bold my-8 text-center text-ink">
        {{ $t('passions') }}
      </h2>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div v-for="(passion, index) in passions" :key="passion.title"
          class="passion-card rounded-lg p-5 text-center"
          :class="{ 'lg:col-span-2': index % 2 === 0 && index === passions.length - 1 }">

          <div class="mb-3 text-4xl leading-none">{{ passion.icon }}</div>
          <h4 class="mb-2 text-lg font-semibold text-ink">
            {{ passion.title }}
          </h4>
          <p class="m-0 text-tone-600">
            {{ passion.description }}
          </p>
        </div>
      </div>
    </section>

    <section client-only v-if="experiences" class="py-4">
      <!-- Experiences -->

      <h2 class="text-2xl font-bold m-0 mb-3 text-center text-ink">
        {{ $t('experiences') }}
      </h2>

      <!-- Carousel with experiences -->
      <LazyCarousel :hydrate-on-visible="{ rootMargin: '200px' }" :items="experiences">
        <template #default="{ item }">
          <NuxtLinkLocale :to="`/projects/${item.slug}`"
            class="absolute p-1 top-0 right-0 text-xl rounded-tr-md rounded-bl-md bg-ink/80 hover:bg-ink"
            :aria-label="item.title">
            <UIcon name="i-ic-baseline-open-in-new" class="bg-paper" />
          </NuxtLinkLocale>
          <LazyNuxtImg :src="item.image" class="hidden md:block absolute bottom-2 right-2 w-15 max-h-20 object-contain pointer-events-none" :aria-label="item.title" />
          <h2 class="text-lg font-semibold m-0 m-0 text-ink w-full pr-8 -my-1 truncate">{{ item.title }}</h2>
          <h4 class="text-sm font-normal m-0 text-ink">{{ item.organization }}</h4>
          <div class="text-xs text-tone-700">
            <template v-if="item.completedAt">
              <template v-if="item.startedAt">{{ formatDate(locale, item.startedAt) }} – </template> {{
                formatDate(locale, item.completedAt) }}
            </template>
            <template v-else>
              {{ formatDate(locale, item.startedAt) }} - {{ $t('project.info.inProgress') }}
            </template>
          </div>
          <p class="text-tone-600 grow m-0 my-1 leading-tight text-balance line-clamp-3 md:pr-16">{{
            item.description
          }}</p>
          <ProjectTechStack v-if="item.technologies" :technologies="item.technologies" class="justify-start mr-15" />
        </template>
      </LazyCarousel>
    </section>

    <section
      class="enterprise-section border-y-[5px] border-tone py-4 rounded-[5px] bg-linear-to-b from-paper to-tone-400 p-2">
      <h2 class="text-2xl font-bold my-2 text-center text-ink">
        {{ $t('enterprise_purposes') }}
      </h2>
      <div class="flex flex-col p-2 gap-6 text-balance">
        <div>
          <h4 class="text-2xl font-semibold m-0 mb-2">Mission</h4>
          <p class="text-tone-600 text-balance leading-relaxed m-0">
            {{ enterprise?.mission }}
          </p>
        </div>
        <div>
          <h4 class="text-2xl font-semibold m-0 mb-2">Vision</h4>
          <p class="text-tone-600 text-balance leading-relaxed m-0">
            {{ enterprise?.vision }}
          </p>
        </div>
        <div>
          <h4 class="text-2xl font-semibold m-0 mb-2">Services</h4>
          <div class="grid grid-rows-3 gap-2">
            <div v-for="service in enterprise?.services" :key="service.name" class="bg-tone/20 rounded-lg flex">
              <div class="text-2xl w-10 grow-0 shrink-0">
                <UIcon v-if="service.iconName" :name="service.iconName" />
                <template v-else>
                  {{ service.icon }}
                </template>
              </div>
              <div>
                <h5 class="font-semibold">{{ service.name }}</h5>
                <p class="text-sm text-tone-600 m-0 text-balance sm:pr-20">{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <slot />
    </section>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '~/components/Project/Header.vue'

interface SkillCategory {
  category: string
  iconName: string
  icon: string
  items: string[]
}

interface Technology {
  name: string
  iconName: string
  level: string
}

interface TechStackCategory {
  category: string
  technologies: Technology[]
}

interface Passion {
  title: string
  icon: string
  description: string
}

interface Service {
  name: string
  icon?: string
  iconName?: string
  description: string
}

interface Enterprise {
  mission: string
  vision: string
  services: Service[]
}

export interface Experience {
  id: string,
  title: string
  organization?: string
  description: string
  icons?: string[]
}

interface ProfileData {
  title: string
  description: string
  skills: SkillCategory[]
  techStack: TechStackCategory[]
  passions: Passion[]
  enterprise?: Enterprise
  experiences?: Experience[]
}

const { locale } = useI18n()

const LazyCarousel = defineLazyHydrationComponent('visible', () => import('~/components/Carousel.vue'))

defineProps<ProfileData>()
</script>

<style scoped>
.about-container {
  animation: fadeInAndSlide 0.6s ease-in-out;
}

.passion-card {
  background-image: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
}

.dark .passion-card {
  background-color: var(--site-paper);
  background-image: none;
}
</style>
