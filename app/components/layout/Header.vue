<template>
  <header>
    <CircleBackground class="background" :color="circleColor" :pulse :image="headerCover" />
    <div class="icons">
      <LinkedinIcon v-if="options.linkedin" :username="options.linkedin" />
      <GithubIcon v-if="options.github" :username="options.github" />
    </div>
    <NuxtLink to="/" class="logo">
      <Transition name="fade">
        <img v-if="headerImage" :key="headerImage.src" :src="headerImage.src" :alt="headerImage.title">
      </Transition>
    </NuxtLink>
    <div class="titles">
      <Transition mode="out-in" name="up">
        <CurvedText :key="computedName" class="title-header" :alone="messages.length === 0"> {{
          computedName }}</CurvedText>
      </Transition>
      <ClientOnly>
        <MessageCarousel transition-name="balance" :data-list="messages" #default="{ data }">
          <CurvedText :key="data" title-level="2" class="subtitle-header">
            {{ data }}
          </CurvedText>
        </MessageCarousel>

      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { random } from '~/utils'

const store = layoutStore();

const {
  description = 'description',
  headerColor,
  emojis = {
    birthday: [],
    normal: [],
  },
  options = {
    github: 'edimitchel',
    linkedin: 'edimitchel',
    isBirthday: false,
  },
  links,
  name,
  withEmoji,
} = defineProps<{
  links?: { path: string; class?: string, name: string }[]
  name: string
  description?: string
  messages: string[]
  headerColor?: string[]
  emojis: {
    birthday: string[]
    normal: string[]
  }
  options: Partial<Record<string, string>>
  withEmoji: boolean
}>()

const headerImage = computed(() => {
  return store.headerImage
})

const headerCover = computed(() => {
  return store.headerCover
})

const hideMenu = computed(() => {
  // return $store.state.layout.hideMenu
  return false
})

const noMenu = computed(() => {
  return links.length > 0
})

const computedName = computed(() => {
  if (!name) {
    return
  }
  else if (!withEmoji) {
    return name
  }
  const n = name.split(' ')

  if (n.length > 1) {
    n.splice(1, 0, random(options.isBirthday ? emojis.birthday : emojis.normal))
  }

  return n.join(' ')
})

const circleColor = computed(() => {
  return headerColor || undefined
})

const { isLoading: pulse } = useLoadingIndicator();

</script>

<style scoped>
header {
  --uno: overflow-hidden flex items-center flex-col text-center pt-2 flex-shrink-0;
}

.logo {
  width: 150px;
  min-width: 150px;
  height: 150px;
  border-radius: 100%;
  cursor: pointer;
  z-index: 100;
  overflow: hidden;
  transition: all 150ms ease;

  & img {
    width: 100%;
  }
}

.logo:hover {
  transform: scale(0.95);
}

.icons {
  max-width: 180px;
  top: 130px;
  --uno: flex justify-between absolute w-full;
}

.titles {
  height: 80px;
  z-index: -1;
}

.title-header {
  transition: all 0.3s;
  position: relative;
  top: 0;
  margin-top: -25px;
  --uno: text-xl font-serif font-bold;
}

@screen md {
  .title-header {
    --uno: text-3xl;
  }
}

.subtitle-header {
  margin-top: -60px;
  --uno: text-xs font-mono font-bold;
}

@screen md {
  .subtitle-header {
    --uno: text-base;
  }
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
}

nav {
  height: 40px;
  transition: all 300ms ease;
  --uno: mt-4 font-serif;
}

nav.hidden {
  height: 0;
  opacity: 0;
}

ul {
  --uno: flex m-0 p-0 list-none;
}

ul li {
  --uno: leading-none align-middle;
}

ul a {
  --uno: mx-1 border-1 border-solid border-transparent text-gray-900 px-2 rounded-full no-underline transition-all;
}

ul a:hover,
ul a:focus {
  --uno: bg-gray-100;
}

ul a.router-link-active {
  --uno: border-1 border-solid border-gray-300;
}
</style>