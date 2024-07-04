<template>
  <header>
    <CircleBackground class="background" :color="circleColor" :pulse="pulse" :image="headerCover" />
    <div class="icons">
      <twitter-icon v-if="options.twitter" :url="options.twitter" />
      <github-icon v-if="options.github" :url="options.github" />
    </div>
    <NuxtLink to="/" class="logo">
      <transition name="fade">
        <img v-if="headerImage" :key="headerImage.src" :src="headerImage.src" :alt="headerImage.title">
      </transition>
    </NuxtLink>
    <div class="titles">
      <transition mode="out-in" name="up">
        <CurvedText :key="computedName" class="title-header" :class="{ alone: messages.length === 0 }"
          :text-style="!messages.length ? 'letter-spacing: 3px' : ''">
          {{ computedName }}
        </CurvedText>
      </transition>
      <client-only>
        <MessageCarousel transition-name="fade" :data-list="messages" #default="{ data }">
          <CurvedText :key="data" title-level="2" class="subtitle-header">
            {{ data }}
          </CurvedText>
        </MessageCarousel>

      </client-only>
    </div>

    <transition name="up">
      <nav v-if="noMenu || hideMenu" :class="{ hidden: hideMenu }">
        <ul>
          <li v-for="item in links" :key="item.path">
            <NuxtLink :to="item.path" :class="item.class">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </transition>
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
    twitter: 'edimitchel',
    isBirthday: false,
  },
  links,
  name,
  withEmoji,
} = defineProps<{
  links: { path: string; class?: string, name: string }[]
  name: string
  description: string
  messages: string[]
  headerColor?: string[]
  emojis: {
    birthday: string[]
    normal: string[]
  }
  options: Record<string, string>
  withEmoji: boolean
}>()

const pulse = ref(false)

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
  else if (withEmoji) {
    return name
  }
  const n = name.split(' ')

  n.splice(1, 0, random(options.isBirthday ? emojis.birthday : emojis.normal))

  return n.join(' ')
})

const circleColor = computed(() => {
  return headerColor || undefined
})

function stopPulse() {
  pulse.value = false
}

</script>

<style scoped>
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

header {
  --uno: overflow-hidden flex items-center flex-col text-center pt-3;
}

.icons {
  max-width: 200px;
  top: 130px;
  --uno: flex justify-between absolute w-full;
}

.titles {
  height: 80px;
  margin-top: -15px;
  z-index: -1;
}

.title-header {
  transition: all 0.3s;
  position: relative;
  top: 0;
  margin-top: -25px;
  --uno: text-xl font-serif font-bold;
}

.title-header.alone {
  top: 10px;
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
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  --uno: absolute;
}

nav {
  height: 40px;
  transition: all 300ms ease;
  --uno: uppercase mt-4 font-serif font-bold;
}

nav.hidden {
  height: 0;
  opacity: 0;
}

ul {
  --uno: flex m-0 p-0 list-none;
}

ul li {
  --uno: p-2 rounded leading-none align-middle no-underline;
}

ul a {
  --uno: m-4 text-gray-900 p-2 rounded leading-none align-middle no-underline;
}

ul a.blog {
  transition: all 0.3s ease;
  --uno: text-blue-500 font-bold;
}

ul a:hover,
ul a:focus {
  --uno: bg-gray-500 text-white;
}

ul a.nuxt-link-active {
  --uno: bg-gray-600 text-white;
}

ul a.blog.nuxt-link-active {
  --uno: bg-blue-500 font-bold text-white;
}
</style>