<template>
  <span 
    :class="badgeClasses"
    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
  >
    <i :class="iconClass" class="w-3 h-3 mr-1" />
    {{ typeLabel }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  type: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const typeConfig = computed(() => {
  switch (props.type) {
    case 'consulting':
      return {
        label: t('project.types.consulting'),
        classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: 'i-heroicons-briefcase'
      }
    case 'experience':
      return {
        label: t('project.types.experience'),
        classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: 'i-heroicons-building-office'
      }
    case 'application':
      return {
        label: t('project.types.application'),
        classes: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
        icon: 'i-heroicons-device-phone-mobile'
      }
    case 'static':
      return {
        label: t('project.types.static'),
        classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: 'i-heroicons-document'
      }
    default:
      return {
        label: props.type,
        classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        icon: 'i-heroicons-tag'
      }
  }
})

const typeLabel = computed(() => typeConfig.value.label)
const badgeClasses = computed(() => typeConfig.value.classes)
const iconClass = computed(() => typeConfig.value.icon)
</script>
