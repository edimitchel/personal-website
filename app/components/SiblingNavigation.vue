<template>
	<nav class="siblings-nav">
		<NuxtLinkLocale
			class="text-left decoration-none hover:underline flex flex-col-reverse items-start gap-1 max-w-[50%]"
			v-if="prev" :to="`/${collection}/${prev.slug}`" :aria-label="t(`${collection.replace(/s$/, '')}.previous`)">
			<span class="text-sm font-medium">{{ prev.title }}</span>
			<UIcon name="i-mdi-arrow-left" aria-hidden="true" />
		</NuxtLinkLocale>
		<div class="grow"></div>
		<NuxtLinkLocale
			class="text-right decoration-none hover:underline flex flex-col-reverse items-end gap-1 max-w-[50%]"
			v-if="next" :to="`/${collection}/${next.slug}`" :aria-label="t(`${collection.replace(/s$/, '')}.next`)">
			<span class="text-sm font-medium">{{ next.title }}</span>
			<UIcon name="i-mdi-arrow-right" aria-hidden="true" />
		</NuxtLinkLocale>
	</nav>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const { t } = useI18n()

const props = defineProps<{
	siblings: (ContentNavigationItem | null)[]
	collection: string
}>()

const prev = computed(() => props.siblings?.[0])
const next = computed(() => props.siblings?.[1])
</script>

<style scoped>
@reference "../assets/css/main.css";

.siblings-nav {
	@apply text-ink flex md:sticky bottom-0 backdrop-blur-md justify-stretch items-start p-3 py-2 md:-mx-12 md:px-12 border-y border-ink;
	mask-image:
		linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
}
</style>
