<template>
  <footer class="font-mono py-2 text-background">
    <div class="text-xs text-center space-y-1">
      <div>
        &copy; {{ year }} Michel Edighoffer –
        <NuxtLinkLocale to="/legal" class="hover:underline">
          {{ $t('footer.legal') }}
        </NuxtLinkLocale>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
const year = new Date().getFullYear()
</script>
