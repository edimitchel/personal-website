<template>
  <div
    class="relative"
    :class="{ 'tech-stack--collapsible': hiddenMoreThan }"
  >
    <div
      class="flex flex-wrap gap-1"
      :class="hiddenMoreThan ? 'tech-stack__tags' : undefined"
    >
      <span
        v-for="tech in technologies"
        :key="tech"
        class="inline-flex items-center px-2 py-1 text-xs bg-tone-300 text-tone-800 rounded font-medium"
      >
        <UIcon
          v-if="getTechIcon(tech)"
          :name="getTechIcon(tech)!"
          class="inline-block shrink-0 w-3.5 h-3.5 mr-1"
        />
        {{ tech }}
      </span>
    </div>
    <span
      v-if="hiddenMoreThan && technologies.length > hiddenMoreThan"
      class="tech-stack__more hidden md:block absolute right-0 bottom-0 px-2 py-1 text-xs text-tone-800 pointer-events-none"
    >
      +{{ technologies.length - hiddenMoreThan }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  technologies: string[]
  hiddenMoreThan?: number
}

defineProps<Props>()
</script>

<style scoped>
@media (min-width: 768px) {
  .tech-stack--collapsible .tech-stack__tags {
    max-height: 1.75rem;
    overflow: hidden;
    transition: max-height 350ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .group:hover .tech-stack--collapsible .tech-stack__tags {
    max-height: 6rem;
  }

  .tech-stack__more {
    opacity: 1;
    transition: opacity 250ms ease;
  }

  .group:hover .tech-stack__more {
    opacity: 0;
  }
}
</style>
