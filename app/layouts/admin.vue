<template>
  <UDashboardGroup class="admin-shell flex-col">
    <header class="admin-bar">
      <NuxtLink
        to="/admin"
        class="admin-brand"
      >
        {{ $t('admin.title') }}
      </NuxtLink>
      <div class="admin-bar-actions">
        <UButton
          v-if="loggedIn"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-log-out"
          :aria-label="$t('admin.auth.signOut')"
          :loading="signingOut"
          @click="logout"
        />
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-up-right"
          :aria-label="$t('admin.backToSite')"
        />
        <UColorModeButton size="sm" />
      </div>
    </header>
    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
useSeoMeta({
  robots: 'noindex, nofollow',
})

const { loggedIn, signOut } = useUserSession()
const signingOut = ref(false)

async function logout() {
  signingOut.value = true
  try {
    await signOut()
  }
  finally {
    signingOut.value = false
  }
}
</script>

<style>
.admin-shell {
  --admin-bg: #fafafa;
  --admin-text: #18181b;
  --admin-muted: #3f3f46;
  --admin-line: #d4d4d8;
  --admin-pad: 1.5rem;
  --admin-gap: 0.75rem;
  --admin-head: 2.5rem;
  --admin-bar: 3rem;
  --ui-header-height: var(--admin-bar);
  background: var(--admin-bg);
  color: var(--admin-text);
  color-scheme: light;
  --ui-bg: var(--admin-bg);
  --ui-bg-muted: var(--admin-bg);
  --ui-bg-elevated: var(--admin-bg);
  --ui-bg-accented: #f4f4f5;
  --ui-text: var(--admin-text);
  --ui-text-highlighted: var(--admin-text);
  --ui-text-toned: var(--admin-muted);
  --ui-text-muted: var(--admin-muted);
  --ui-text-dimmed: var(--admin-muted);
  --ui-border: var(--admin-line);
  --ui-border-muted: var(--admin-line);
  --ui-border-accented: var(--admin-line);
}

.dark .admin-shell {
  --admin-bg: #141416;
  --admin-text: #fafafa;
  --admin-muted: #c4c4cc;
  --admin-line: #4a4a52;
  --ui-bg-accented: #222226;
  color-scheme: dark;
}

.admin-bar {
  display: flex;
  height: var(--admin-bar);
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--admin-line);
  padding-inline: var(--admin-pad);
}

.admin-brand {
  color: var(--admin-text);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
}

.admin-brand:hover {
  color: var(--admin-text);
}

.admin-bar-actions {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  margin-inline-start: auto;
}

.admin-page {
  display: flex;
  flex-direction: column;
  gap: var(--admin-gap);
  padding: var(--admin-pad);
}

.admin-lead {
  margin: 0;
  color: var(--admin-muted);
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.admin-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--admin-gap);
}

.admin-bleed {
  margin-inline: calc(var(--admin-pad) * -1);
}

.admin-index-row {
  display: flex;
  align-items: center;
  gap: var(--admin-gap);
  margin-inline: calc(var(--admin-pad) * -1);
  padding: 0.625rem var(--admin-pad);
  border-bottom: 1px solid var(--admin-line);
  color: inherit;
  text-decoration: none;
}

.admin-index-row:first-child {
  border-top: 1px solid var(--admin-line);
}

.admin-index-row:hover,
.admin-index-row:focus-visible {
  background: var(--ui-bg-accented);
  outline: none;
}

.admin-segment {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.125rem;
  border: 1px solid var(--admin-line);
  border-radius: 0.375rem;
}

.admin-sep {
  width: 1px;
  height: 1rem;
  flex-shrink: 0;
  background: var(--admin-line);
}

.admin-split {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.admin-col {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.admin-col-head {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  height: var(--admin-head);
  flex-shrink: 0;
  align-items: center;
  gap: var(--admin-gap);
  border-bottom: 1px solid var(--admin-line);
  background: var(--admin-bg);
  padding-inline: var(--admin-pad);
  color: var(--admin-muted);
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

.admin-col-scroll {
  min-width: 0;
}

.admin-col-pad {
  padding: var(--admin-pad);
}

.admin-split.is-split > .admin-col + .admin-col {
  border-top: 1px solid var(--admin-line);
}

.admin-doc {
  display: flex;
  flex-direction: column;
  gap: var(--admin-gap);
  padding: var(--admin-pad);
  padding-bottom: var(--admin-gap);
}

.admin-doc-title {
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--admin-text);
  font-family: var(--font-sans);
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.15;
  outline: none;
}

.admin-shell .admin-doc-title::placeholder {
  color: var(--admin-muted);
  font-weight: 500;
}

.admin-fiche {
  display: grid;
  gap: var(--admin-gap);
}

.admin-field {
  display: grid;
  grid-template-columns: 8.75rem minmax(0, 1fr);
  align-items: start;
  column-gap: var(--admin-gap);
}

.admin-field-label {
  display: flex;
  align-items: center;
  min-height: 1.75rem;
  color: var(--admin-muted);
  font-size: 0.8125rem;
  line-height: 1.25rem;
}

.admin-field-control {
  min-width: 0;
}

.admin-field-control:has(.admin-field-check) {
  display: flex;
  align-items: center;
  min-height: 1.75rem;
}

.admin-editor-toolbar {
  position: sticky;
  top: var(--admin-head);
  z-index: 10;
  width: 100%;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--admin-line);
  background: var(--admin-bg);
  padding: 0.25rem calc(var(--admin-pad) - 0.25rem);
}

.admin-suggestions {
  display: grid;
  gap: var(--admin-gap);
  margin-top: var(--admin-gap);
}

.admin-suggestion {
  display: grid;
  gap: var(--admin-gap);
  border: 1px dashed var(--admin-line);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
}

.admin-shell .admin-preview :where(h1) {
  margin-top: 0;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.admin-shell .prose,
.admin-shell .prose :where(h1, h2, h3, h4, p, li, blockquote) {
  color: var(--admin-text);
}

.admin-shell input,
.admin-shell textarea {
  color: var(--admin-text);
}

.admin-shell input::placeholder,
.admin-shell textarea::placeholder {
  color: var(--admin-muted);
}

@media (max-width: 40rem) {
  .admin-field {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0.25rem;
  }

  .admin-field-label {
    min-height: 0;
  }
}

@media (min-width: 80rem) {
  .admin-col-head {
    position: static;
  }

  .admin-editor-toolbar {
    top: 0;
  }

  .admin-split {
    overflow: hidden;
  }

  .admin-split > .admin-col {
    flex: 1;
    min-height: 0;
  }

  .admin-col-scroll {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  .admin-split.is-split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
  }

  .admin-split.is-split > .admin-col + .admin-col {
    border-top: 0;
    border-inline-start: 1px solid var(--admin-line);
  }
}
</style>
