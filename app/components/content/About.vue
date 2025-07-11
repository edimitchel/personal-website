<template>
  <div class="about-container mx-auto px-4 py-2">
    <!-- Hero Section with Picture and Basic Info -->
    <section>
      <div class="flex flex-col lg:flex-row items-center gap-8">
        <div class="profile-info flex-1 text-center">
          <h2 class="text-xl lg:text-2xl underline underline-gray-600 mb-4">
            {{ title }}
          </h2>
          <p class="text-lg leading-relaxed">
            {{ description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="skills-section mb-12">
      <h3 class="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Skills & Expertise
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div 
          v-for="skillCategory in skills" 
          :key="skillCategory.category"
          class="skill-category bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
        >
          <h4 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <span class="text-2xl mr-3"><i :class="skillCategory.icon" /></span>
            {{ skillCategory.category }}
          </h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="skill in skillCategory.items" 
              :key="skill"
              class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="tech-stack-section mb-12">
      <h3 class="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Technology Stack
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          v-for="stackCategory in techStack" 
          :key="stackCategory.category"
          class="stack-category"
        >
          <h4 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {{ stackCategory.category }}
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div 
              v-for="tech in stackCategory.technologies" 
              :key="tech.name"
              class="tech-item bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="text-3xl mb-2"><i :class="tech.icon" /></div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ tech.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ tech.level }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Passions Section -->
    <section class="passions-section mb-12">
      <h3 class="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Passions & Interests
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="passion in passions" 
          :key="passion.title"
          class="passion-card bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300"
        >
          <div class="text-4xl mb-4 text-center"><i :class="passion.icon" /></div>
          <h4 class="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-white">
            {{ passion.title }}
          </h4>
          <p class="text-gray-600 dark:text-gray-300 text-center">
            {{ passion.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Enterprise Purposes Section -->
    <section class="enterprise-section">
      <h3 class="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
        Enterprise & Business Goals
      </h3>
      <div class="bg-gradient-to-br from-gray-900 to-gray-600 rounded-lg p-8 text-white">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 class="text-2xl font-semibold mb-4 text-black">Mission</h4>
            <p class="text-gray-600 leading-relaxed">
              {{ enterprise?.mission }}
            </p>
          </div>
          <div>
            <h4 class="text-2xl font-semibold mb-4 text-black">Vision</h4>
            <p class="text-gray-600 leading-relaxed">
              {{ enterprise?.vision }}
            </p>
          </div>
        </div>
        <div class="mt-8">
          <h4 class="text-2xl font-semibold mb-4 text-black">Services</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              v-for="service in enterprise?.services" 
              :key="service.name"
              class="bg-white bg-opacity-20 rounded-lg p-4 text-center"
            >
              <div class="text-2xl mb-2"><UnoIcon :icon="service.icon" /></div>
              <h5 class="font-semibold mb-2">{{ service.name }}</h5>
              <p class="text-sm text-gray-600">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface SkillCategory {
  category: string
  icon: string
  items: string[]
}

interface Technology {
  name: string
  icon: string
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
  icon: string
  description: string
}

interface Enterprise {
  mission: string
  vision: string
  services: Service[]
}

interface ProfileData {
  title: string
  description: string
  skills: SkillCategory[]
  techStack: TechStackCategory[]
  passions: Passion[]
  enterprise: Enterprise
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

.skill-category:hover {
  transform: translateY(-2px);
}

.tech-item:hover {
  transform: translateY(-2px);
}

.passion-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
