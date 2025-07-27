<template>
  <div
    class="contact-form-inline border-2 border-primary-600 md:w-1/2 w-full md:mx-auto rounded-lg my-4 bg-foreground shadow-lg transition-all duration-200"
    :class="{
      'md:w-full': isVisible,
    }">
    <slot :isVisible="isVisible" @toggle="isVisible = !isVisible">
      <button @click="isVisible = !isVisible"
        class="block p-4 w-full uppercase font-extrabold tracking-widest cursor-pointer">
        {{ $t('about.contact-me') }}
      </button>
    </slot>

    <Transition name="contact-form" mode="out-in">
      <form v-if="isVisible" ref="formRef" @submit.prevent @keydown="handleGlobalKeyDown" @keyup="handleGlobalKeyUp"
        class="px-4 space-y-3 pb-4" :class="{
          'absolute m-0 p-10 top-0 left-0 right-0 text-background bg-foreground z-110': teleport && isVisible
        }">
        <!-- Form Fields in a compact grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <input v-model="form.name" type="text" required
              class="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              :placeholder="$t('contact.name_placeholder')" />
          </div>
          <div>
            <input v-model="form.email" type="email" required
              class="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              :placeholder="$t('contact.email_placeholder')" />
          </div>
        </div>

        <div>
          <textarea v-model="form.message" required rows="3"
            class="w-full px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-vertical text-sm"
            :placeholder="$t('contact.message_placeholder')"></textarea>
        </div>

        <!-- Submit Button with Integrated Captcha -->
        <div class="flex gap-2">
          <button type="button" @click="closeForm"
            class="px-4 py-2 border border-primary-300 text-primary-700 rounded-md hover:bg-primary-400 transition-colors text-sm"
            :disabled="isSubmitting">
            {{ $t('contact.cancel') }}
          </button>

          <button type="submit" @mousedown="startHold" @mouseup="endHold" @mouseleave="endHold" @touchstart="startHold"
            @touchend="endHold" @touchcancel="endHold" @blur="endHold" @contextmenu.prevent
            class="flex-1 py-2 px-4 rounded-md font-medium transition-all duration-150 relative overflow-hidden captcha-submit-button text-sm"
            :class="submitButtonClass" :disabled="isSubmitting">
            <div class="absolute left-0 top-0 h-full transition-all duration-75 ease-linear"
              :class="!isCaptchaValid ? 'bg-primary-700' : 'bg-transparent'" :style="{ width: `${holdProgress}%` }">
            </div>
            <span class="relative z-10 flex gap-2 items-center justify-center">
              <UnoIcon v-if="isSubmitting" class="i-svg-spinners-180-ring-with-bg" />
              {{ submitButtonText }}
            </span>
          </button>
        </div>

        <!-- Compact help text -->
        <div v-if="!isCaptchaValid && !isSubmitting" class="text-xs text-primary-600 text-center">
          {{ $t('contact.captcha_help_short') }}
        </div>

        <!-- Success/Error Messages -->
        <div v-if="submitStatus === 'success'"
          class="mt-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
          {{ $t('contact.success_message') }}
        </div>
        <div v-if="submitStatus === 'error'"
          class="mt-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {{ $t('contact.error_message') }}
        </div>
      </form>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface ContactForm {
  name: string
  email: string
  message: string
}

interface Props {
  teleport?: string
}


const isVisible = defineModel<boolean>('isVisible', {
  default: false,
})

defineProps<Props>()

const { t } = useI18n()

const formRef = useTemplateRef<HTMLFormElement | null>('formRef')

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
const HOLD_DURATION = 2_000 // 2 seconds

// Submit state
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')

// Computed properties
const submitButtonClass = computed(() => {
  if (!isFormValid.value) {
    return 'bg-gray-300 text-white cursor-not-allowed'
  }
  if (isSubmitting.value) {
    return 'bg-primary-600 text-white cursor-not-allowed'
  }
  if (isCaptchaValid.value) {
    return 'bg-green-700 text-white hover:bg-green-700'
  }
  if (isHolding.value) {
    return 'bg-primary-600 text-white'
  }
  return 'bg-primary-600 text-white hover:bg-primary-700'
})

const submitButtonText = computed(() => {
  if (!isFormValid.value) {
    return t('contact.fill_form')
  }

  if (isSubmitting.value) {
    return t('contact.sending')
  }
  if (isCaptchaValid.value) {
    return '✓ ' + t('contact.send')
  }
  if (isHolding.value) {
    return t('contact.holding')
  }
  return t('contact.hold_to_send')
})

// Methods
const startHold = async () => {

  if (!isFormValid.value) {
    formRef.value?.reportValidity()
    return
  }

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

const isFormValid = ref(false);

watch([formRef, form], () => {
  isFormValid.value = formRef.value?.checkValidity() || false;
}, { deep: true })

const endHold = () => {
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

// Global keyboard event handlers for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
const handleGlobalKeyDown = (event: KeyboardEvent) => {
  // Only trigger if both keys are pressed in the same event
  const isModifierPressed = event.metaKey || event.ctrlKey
  const isEnterPressed = event.code === 'Enter'

  if (isModifierPressed && isEnterPressed) {
    event.preventDefault()

    // Only start hold if not already holding and not already validated
    if (!isHolding.value && !isCaptchaValid.value && !isSubmitting.value) {
      startHold()
    }
  }
}

const handleGlobalKeyUp = (event: KeyboardEvent) => {
  // End hold when either modifier or Enter key is released
  if ((event.code === 'MetaLeft' || event.code === 'MetaRight' ||
    event.code === 'ControlLeft' || event.code === 'ControlRight') ||
    event.code === 'Enter') {
    endHold()
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
  if (isSubmitting.value) {
    resetForm()
  }
  isVisible.value = false
}

watch(isCaptchaValid, () => {
  if (isCaptchaValid.value) {
    handleSubmit()
  }
})

const handleSubmit = async () => {
  if (!isCaptchaValid.value || isSubmitting.value) return

  isSubmitting.value = true
  submitStatus.value = 'idle'

  try {
    const { status } = await useFetch('/api/contact-me', {
      method: 'POST',
      body: form.value,
      onResponseError: async (error) => {
        console.error('Contact form error:', error)
        submitStatus.value = 'error'

        isCaptchaValid.value = false
        return false;
      }
    })

    if (status.value === "success") {
      submitStatus.value = 'success'

      // Auto-close after success
      setTimeout(() => {
        closeForm()
      }, 5000)
    }

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
watch(() => isVisible.value, (newValue) => {
  if (newValue) {
    resetForm()
  }
})
</script>

<style scoped>
/* Prevent context menu and text selection on submit button */
.captcha-submit-button {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.captcha-submit-button:focus {
  outline: none;
}

/* Contact form inline styling */
.contact-form-inline {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Smooth contact form transitions */
.contact-form-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.contact-form-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.6, 1);
}

.contact-form-enter-from {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
  overflow: hidden;
}

.contact-form-enter-to {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.contact-form-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 500px;
}

.contact-form-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
  overflow: hidden;
}
</style>
