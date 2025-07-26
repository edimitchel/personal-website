<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-foreground rounded-lg p-6 w-full max-w-md shadow-xl">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-background">{{ $t('contact.title') }}</h3>
        <button
          @click="closeForm"
          class="text-primary-600 hover:text-primary-800 text-2xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-background mb-1">
            {{ $t('contact.name') }}
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :placeholder="$t('contact.name_placeholder')"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-background mb-1">
            {{ $t('contact.email') }}
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            :placeholder="$t('contact.email_placeholder')"
          />
        </div>

        <div>
          <label for="message" class="block text-sm font-medium text-background mb-1">
            {{ $t('contact.message') }}
          </label>
          <textarea
            id="message"
            v-model="form.message"
            required
            rows="4"
            class="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical"
            :placeholder="$t('contact.message_placeholder')"
          ></textarea>
        </div>

        <!-- Press and Hold Captcha -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-background">
            {{ $t('contact.captcha_instruction') }}
          </label>
          <div class="relative">
            <button
              type="button"
              @mousedown="startHold"
              @mouseup="endHold"
              @mouseleave="endHold"
              @touchstart="startHold"
              @touchend="endHold"
              @touchcancel="endHold"
              @contextmenu.prevent
              class="w-full py-3 px-4 rounded-md font-medium transition-all duration-150 relative overflow-hidden captcha-button"
              :class="captchaButtonClass"
              :disabled="isSubmitting"
            >
              <div
                class="absolute left-0 top-0 h-full bg-primary-600 transition-all duration-75 ease-linear"
                :style="{ width: `${holdProgress}%` }"
              ></div>
              <span class="relative z-10">
                {{ captchaButtonText }}
              </span>
            </button>
          </div>
          <div class="text-xs text-primary-600">
            {{ $t('contact.captcha_help') }}
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="closeForm"
            class="flex-1 px-4 py-2 border border-primary-300 text-primary-700 rounded-md hover:bg-primary-50 transition-colors"
            :disabled="isSubmitting"
          >
            {{ $t('contact.cancel') }}
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!isCaptchaValid || isSubmitting"
          >
            <span v-if="!isSubmitting">{{ $t('contact.send') }}</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('contact.sending') }}
            </span>
          </button>
        </div>
      </form>

      <!-- Success/Error Messages -->
      <div v-if="submitStatus === 'success'" class="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
        {{ $t('contact.success_message') }}
      </div>
      <div v-if="submitStatus === 'error'" class="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
        {{ $t('contact.error_message') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ContactForm {
  name: string
  email: string
  message: string
}

interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const { t} = useI18n()

// Form data
const form = ref<ContactForm>({
  name: '',
  email: '',
  message: ''
})

// Captcha state
const holdProgress = ref(0)
const isCaptchaValid = ref(false)
const isHolding = ref(false)
const holdTimer = ref<NodeJS.Timeout | null>(null)
const HOLD_DURATION = 3000 // 3 seconds

// Submit state
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

// Computed properties
const captchaButtonClass = computed(() => {
  if (isCaptchaValid.value) {
    return 'bg-green-500 text-white border-green-500'
  }
  return 'bg-primary-100 text-primary-700 border-primary-300 hover:bg-primary-200'
})

const captchaButtonText = computed(() => {
  if (isCaptchaValid.value) {
    return '✓ ' + t('contact.verified')
  }
  if (isHolding.value) {
    return t('contact.holding')
  }
  return t('contact.hold_to_verify')
})

// Methods
const startHold = () => {
  if (isCaptchaValid.value || isSubmitting.value) return
  
  isHolding.value = true
  holdProgress.value = 0
  
  const startTime = Date.now()
  
  holdTimer.value = setInterval(() => {
    const elapsed = Date.now() - startTime
    holdProgress.value = Math.min((elapsed / HOLD_DURATION) * 100, 100)
    
    if (elapsed >= HOLD_DURATION) {
      isCaptchaValid.value = true
      isHolding.value = false
      if (holdTimer.value) {
        clearInterval(holdTimer.value)
        holdTimer.value = null
      }
    }
  }, 50)
}

const endHold = () => {
  if (!isHolding.value) return
  
  isHolding.value = false
  
  if (holdTimer.value) {
    clearInterval(holdTimer.value)
    holdTimer.value = null
  }
  
  // Reset progress if not completed
  if (!isCaptchaValid.value) {
    holdProgress.value = 0
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    message: ''
  }
  isCaptchaValid.value = false
  holdProgress.value = 0
  submitStatus.value = 'idle'
}

const closeForm = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  if (!isCaptchaValid.value || isSubmitting.value) return
  
  isSubmitting.value = true
  submitStatus.value = 'idle'
  
  try {
    await $fetch('/api/contact-me', {
      method: 'POST',
      body: form.value
    })
    
    submitStatus.value = 'success'
    
    // Auto-close after success
    setTimeout(() => {
      closeForm()
    }, 5000)
    
  } catch (error) {
    console.error('Contact form error:', error)
    submitStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  if (holdTimer.value) {
    clearInterval(holdTimer.value)
  }
})

// Reset captcha when form becomes visible
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>

<style scoped>
/* Additional styles for better UX */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Prevent context menu and text selection on captcha button */
.captcha-button {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.captcha-button:focus {
  outline: none;
}
</style>
