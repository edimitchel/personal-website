<template>
  <UDashboardGroup class="admin-shell flex-col">
    <header class="border-default flex h-12 shrink-0 items-center gap-3 border-b px-4">
      <NuxtLink
        to="/admin"
        class="font-semibold"
      >
        {{ $t('admin.title') }}
      </NuxtLink>
      <div class="ml-auto flex items-center gap-1">
        <UButton
          to="/"
          color="neutral"
          variant="ghost"
          icon="i-lucide-arrow-up-right"
          :aria-label="$t('admin.backToSite')"
        />
        <UColorModeButton />
      </div>
    </header>
    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
useSeoMeta({
  robots: 'noindex, nofollow',
})
</script>

<style>
.admin-shell {
  --admin-bg: #fafafa;
  --admin-text: #18181b;
  --admin-muted: #3f3f46;
  --admin-line: #d4d4d8;
  background: var(--admin-bg);
  color: var(--admin-text);
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
</style>
