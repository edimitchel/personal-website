<template>
	<nav class="flex justify-stretch items-start p-4 md:px-0 md:max-w-[100%] -mx-[calc(50vw-50%)] md:mx-0">
		<NuxtLinkLocale
			class="text-left  decoration-none hover:underline flex flex-col-reverse items-start gap-0 max-w-[40%]"
			v-if="prev" :to="`/${collection}/${prev.slug}`" :aria-label="t(`${collection.replace(/s$/, '')}.previous`)">{{ prev.title }}
			<UnoIcon class="i-mdi-arrow-left" aria-hidden="true" />
		</NuxtLinkLocale>
		<div class="flex-grow-1"></div>
		<NuxtLinkLocale
			class="text-right  decoration-none hover:underline flex flex-col-reverse items-end gap-0 max-w-[40%]"
			v-if="next" :to="`/${collection}/${next.slug}`" :aria-label="t(`${collection.replace(/s$/, '')}.next`)">{{ next.title }}
			<UnoIcon class="i-mdi-arrow-right" aria-hidden="true" />
		</NuxtLinkLocale>
	</nav>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const { t } = useI18n()

const props = defineProps<{
	siblings: ContentNavigationItem[]
	collection: string
}>()

const prev = computed(() => props.siblings?.[0])
const next = computed(() => props.siblings?.[1])
</script>
