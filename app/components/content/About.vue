<template>
  <div class="about-container mx-auto px-4 py-2">
    <section>
      <div class="flex flex-col lg:flex-row items-center gap-8">
        <div class="profile-info flex-1 text-center">
          <h2 class="text-2xl lg:text-3xl underline underline-primary-600 mb-4 mt-0">
            {{ title }}
          </h2>
          <p class="text-lg leading-relaxed text-balance">
            {{ description }}
          </p>
        </div>
      </div>
    </section>

    <button
      class="block w-50 my-4 mx-auto border-2 border-primary-600 rounded-lg px-4 py-2 uppercase cursor-pointer transition-colors duration-150 hover:bg-primary-600 hover:text-foreground">
      {{ $t('about.contact-me') }}
    </button>

    <section class="skills-section mb-12">
      <h3 class="text-3xl font-bold my-8 text-center text-background">
        {{ $t('skills_n_expertise') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <SpotlightCard spotlight-color="#f4f4f4" v-for="(skillCategory, index) in skills" :key="skillCategory.category"
          class="skill-category bg-foreground rounded-lg p-6 shadow-sm shadow-primary/40 transition-shadow"
          :class="{ 'md:col-span-2': index % 2 === 0 && index === skills.length - 1 }">
          <h4 class="text-xl font-semibold m-0 mb-4 text-background flex items-center">
            <span class="text-2xl mr-2"><i v-if="skillCategory.iconName" :class="skillCategory.iconName" /><template
                v-else>{{ skillCategory.icon }}</template></span>
            {{ skillCategory.category }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <span v-for="skill in skillCategory.items" :key="skill"
              class="px-3 py-1 bg-background text-foreground rounded-full text-sm font-medium">
              {{ skill }}
            </span>
          </div>
        </SpotlightCard>
      </div>
    </section>

    <section class="tech-stack-section mb-12">
      <h3 class="text-3xl font-bold my-8 text-center text-background">
        {{ $t('tech_stack') }}
      </h3>
      <div class="grid grid-cols-1 gap-8">
        <div v-for="stackCategory in techStack" :key="stackCategory.category" class="stack-category">
          <h4 class="text-xl font-semibold mb-4 text-background">
            {{ stackCategory.category }}
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div v-for="(tech, index) in stackCategory.technologies" :key="tech.name"
              class="tech-item bg-foreground rounded-lg p-4 text-center shadow-sm shadow-primary/40 transition-shadow">

              <div class="text-3xl mb-2"><i class="inline-block" :class="tech.iconName" /></div>
              <div class="text-sm font-medium text-background">{{ tech.name }}</div>
              <div class="text-xs text-primary-500">{{ tech.level }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="passions-section mb-12">
      <h3 class="text-3xl font-bold my-8 text-center text-background">
        {{ $t('passions') }}
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2">
        <div v-for="(passion, index) in passions" :key="passion.title"
          class="passion-card bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-2 transition-all duration-300"
          :class="{ 'lg:col-span-2': index % 2 === 0 && index === passions.length - 1 }">

          <div class="text-4xl mb-4 text-center"><i class="block" :class="passion.icon" /></div>
          <h4 class="text-lg font-semibold mb-2 text-center text-background">
            {{ passion.title }}
          </h4>
          <p class="text-primary-600 text-center m-0">
            {{ passion.description }}
          </p>
        </div>
      </div>
    </section>

    <section client-only v-if="experiences" class="py-4">
      <!-- Experiences -->

      <h3 class="text-3xl font-bold m-0 text-center text-background">
        {{ $t('experiences') }}
      </h3>

      <!-- Carousel with experiences -->
      <Carousel :items="experiences">
        <template #default="{ item }">
          <h4 class="text-lg font-semibold m-0 mb-0 text-background">{{ item.title }}</h4>
          <h2 class="text-sm font-normal m-0 text-background">{{ item.organization }}</h2>
          <p class="text-primary-600 flex-grow-1 m-0 my-1 leading-tight text-balance line-clamp-3">{{ item.description }}</p>
          <div v-if="item.icons" class="flex gap-2 mt-2">
            <UnoIcon v-for="icon in item.icons" :key="icon" :class="icon" />
          </div>
        </template>
      </Carousel>
    </section>

    <section
      class="enterprise-section border-y-(5 primary) py-4 rounded-[5px] bg-linear-to-tb from-foreground to-primary-400 p-2">
      <h3 class="text-3xl font-bold my-2 text-center text-background">
        {{ $t('enterprise_purposes') }}
      </h3>
      <div class="flex flex-col p-2 gap-6 text-balance">
        <div>
          <h4 class="text-2xl font-semibold m-0 mb-2">Mission</h4>
          <p class="text-primary-600 text-balance leading-relaxed m-0">
            {{ enterprise?.mission }}
          </p>
        </div>
        <div>
          <h4 class="text-2xl font-semibold m-0 mb-2">Vision</h4>
          <p class="text-primary-600 text-balance leading-relaxed m-0">
            {{ enterprise?.vision }}
          </p>
        </div>
        <div>
          <h4 class="text-2xl font-semibold m-0 mb-2">Services</h4>
          <div class="grid grid-rows-3 gap-2">
            <div v-for="service in enterprise?.services" :key="service.name" class="bg-opacity-20 rounded-lg flex">
              <div class="text-2xl w-10 grow-0 shrink-0">
                <UnoIcon v-if="service.iconName" :class="service.iconName" />
                <template v-else>
                  {{ service.icon }}
                </template>
              </div>
              <div>
                <h5 class="font-semibold">{{ service.name }}</h5>
                <p class="text-sm text-primary-600 m-0 text-balance sm:pr-20">{{ service.description }}</p>
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
// Explicitly include icon classes for UnoCSS to detect
const iconClasses = [
  'i-logos-vue', 'i-logos-nuxt-icon', 'i-logos-typescript-icon', 'i-logos-react', 'i-logos-unocss', 'i-logos-sass', 'i-logos-nodejs', 'i-logos-php', 'i-logos-mysql', 'i-logos-postgresql',
];

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

const props = defineProps<ProfileData>()
</script>

<style scoped>
.about-container {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
