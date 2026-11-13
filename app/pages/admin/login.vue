<template>
  <div class="flex flex-1 items-center justify-center p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        :providers="providers"
        :title="title"
        :description="$t('admin.auth.description')"
        :separator="providers.length ? $t('admin.auth.or') : undefined"
        :loading="pending"
        :submit="{ label: submitLabel }"
        icon="i-lucide-lock"
        @submit="onSubmit"
      >
        <template
          v-if="formError"
          #validation
        >
          <UAlert
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            :title="formError"
          />
        </template>
        <template #footer>
          <UButton
            color="neutral"
            variant="link"
            class="px-0"
            @click="toggleMode"
          >
            {{ mode === 'sign-in' ? $t('admin.auth.createAccount') : $t('admin.auth.haveAccount') }}
          </UButton>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'

definePageMeta({
  layout: 'admin',
  auth: { only: 'guest', redirectTo: '/admin' },
})
defineI18nRoute(false)

const { t, te } = useI18n()
const route = useRoute()
const mode = ref<'sign-in' | 'sign-up'>('sign-in')
const pending = ref(false)
const formError = ref('')

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
})

type Schema = z.output<typeof schema>

const { data: providerFlags } = await useFetch('/api/admin-auth/providers')
const signInEmail = useSignIn('email')
const signUpEmail = useSignUp('email')
const signInSocial = useSignIn('social')

const title = computed(() => mode.value === 'sign-in' ? t('admin.auth.signIn') : t('admin.auth.signUp'))
const submitLabel = computed(() => title.value)

const fields = computed<AuthFormField[]>(() => [
  {
    name: 'email',
    type: 'email',
    label: t('admin.auth.email'),
    required: true,
    autocomplete: 'username',
  },
  {
    name: 'password',
    type: 'password',
    label: t('admin.auth.password'),
    required: true,
    autocomplete: mode.value === 'sign-in' ? 'current-password' : 'new-password',
  },
])

const providers = computed(() => {
  if (!providerFlags.value?.github) {
    return []
  }
  return [{
    label: t('admin.auth.github'),
    icon: 'i-lucide-github',
    color: 'neutral' as const,
    variant: 'subtle' as const,
    onClick: () => {
      void signInSocial.execute({
        provider: 'github',
        callbackURL: safeRedirect(route.query.redirect),
      })
    },
  }]
})

function safeRedirect(value: unknown) {
  if (typeof value !== 'string') {
    return '/admin'
  }
  if (!value.startsWith('/admin') || value.startsWith('//') || value.includes('\\') || value.includes('://')) {
    return '/admin'
  }
  if (value.startsWith('/admin/login')) {
    return '/admin'
  }
  return value
}

function errorText(action: { error: { value: { code?: string, status?: number } | null } }) {
  const code = action.error.value?.code
  const status = action.error.value?.status
  if (code === 'FORBIDDEN' || status === 403) {
    return t('admin.auth.notAllowed')
  }
  if (code) {
    const key = `auth.errors.${code}`
    if (te(key)) {
      return t(key)
    }
  }
  return t('admin.auth.invalid')
}

function toggleMode() {
  mode.value = mode.value === 'sign-in' ? 'sign-up' : 'sign-in'
  formError.value = ''
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  pending.value = true
  formError.value = ''
  const destination = safeRedirect(route.query.redirect)
  try {
    if (mode.value === 'sign-up') {
      await signUpEmail.execute({
        email: event.data.email,
        password: event.data.password,
        name: event.data.email.split('@')[0] || 'Admin',
      }, {
        onSuccess: () => navigateTo(destination),
      })
      if (signUpEmail.error.value) {
        formError.value = errorText(signUpEmail)
      }
      return
    }
    await signInEmail.execute({
      email: event.data.email,
      password: event.data.password,
    }, {
      onSuccess: () => navigateTo(destination),
    })
    if (signInEmail.error.value) {
      formError.value = errorText(signInEmail)
    }
  }
  catch {
    formError.value = errorText(mode.value === 'sign-up' ? signUpEmail : signInEmail)
  }
  finally {
    pending.value = false
  }
}
</script>
