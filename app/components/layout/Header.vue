<template>
  <header>
    <CircleBackground class="background" :color="circleColor" :pulse="pulse" :image="headerCover" />
    <div class="icons">
      <SocialIcon v-if="options.linkedin" platform="linkedin" :username="options.linkedin" />
      <SocialIcon v-if="options.github" platform="github" :username="options.github" />
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
      <MessageCarousel transition-name="balance" :data-list="messages" #default="{ data }">
        <CurvedText :key="data" title-level="2" class="subtitle-header">
          {{ data }}
        </CurvedText>
      </MessageCarousel>
    </div>

    <nav class="navigation" v-if="noMenu || hideMenu" :class="{ hidden: hideMenu }">
      <ul>
        <li v-for="(item, index) in links" :key="item.path" :style="{ '--index': index, '--count': links?.length }">
          <NuxtLink :to="item.path" :class="item.class">
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import type { LayoutHeaderProps } from '~/layouts/default.vue';
import { random } from '~/utils'

const store = layoutStore();

const {
  description,
  headerColor,
  emojis = {
    birthday: [],
    normal: [],
  },
  options,
  links,
  name,
  withEmoji,
  messages
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
  options: LayoutHeaderProps['options'],
  withEmoji: boolean
}>()

const headerImage = computed(() => {
  return store.headerImage
})

const headerCover = computed(() => {
  return store.headerCover
})

const hideMenu = computed(() => {
  return false
})

const noMenu = computed(() => {
  return links?.length ?? 0 > 0
})

const computedName = useState('computedName', () => {
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
  margin-top: -15px;
  transition: all 150ms ease;

  & img {
    width: 100%;
  }
}

.logo:hover {
  transform: scale(0.95);
}

.icons {
  max-width: 140px;
  top: 120px;
  --uno: flex justify-between absolute w-full;
}

.titles {
  height: 60px;
  z-index: -1;
}

.title-header {
  transition: all 0.3s;
  position: relative;
  top: 0;
  margin-top: -35px;
  --uno: text-xl font-serif font-bold;
}

@screen md {
  .title-header {
    --uno: text-[27px];
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

.navigation {
  height: 40px;
  transition: all 300ms ease;
  --uno: mt-4 font-serif;
}

.navigation.hidden {
  height: 0;
  opacity: 0;
}

ul {
  --uno: flex m-0 p-0 list-none;
}

ul li {
  --uno: leading-none align-middle;

  --mid: calc(round(down, var(--count) / 2));
  --delta: calc(var(--index) - var(--mid));

  transform: 
    rotateZ(calc(-12deg * var(--delta))) 
    translate(
      calc(10px * var(--delta)),
      calc(min((5px * var(--delta)), (5px * var(--delta)) * -1))
    );
  transform-origin: rotate(calc(150% * var(--delta))) 0%;
}

ul a {
  --uno: block mx-1 text-gray-900 px-2 py-1 rounded-full no-underline transition-all w-16;
  position: relative;
}

ul a:hover {
  --uno: bg-gray-100;
}

ul a.router-link-active::before {
  content: '';
  position: absolute;
  inset: 0;
  --uno: border-(1 gray-300 solid) rounded-full pointer-events-none;
  view-transition-name: menu-border-frame;
}
</style>