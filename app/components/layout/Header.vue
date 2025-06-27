<template>
  <header class="header">
    <CircleBackground class="background" :color="circleColor" :pulse="pulse" :image="headerCover" />
    <div class="icons">
      <SocialIcon v-if="options.github" platform="github" :username="options.github" />
      <SocialIcon v-if="options.linkedin" platform="linkedin" :username="options.linkedin" />
    </div>
    <NuxtLink to="/" class="logo">
      <Transition name="fade">
        <img v-if="headerImage" :key="headerImage.src" :src="headerImage.src" :alt="headerImage.title">
      </Transition>
    </NuxtLink>
    <div class="titles">
      <CurvedText :key="computedName" class="title-header" :alone="messages.length === 0"> {{
        computedName }}</CurvedText>
      <MessageCarousel transition-name="up" :list="messages" #default="{ message, level = 2 }">
        <CurvedText :key="message" :title-level="level" class="subtitle-header">
          {{ message }}
        </CurvedText>
      </MessageCarousel>
    </div>

    <nav class="navigation" v-if="noMenu || hideMenu" :class="{ hidden: hideMenu }">
      <ul>
        <li v-for="(item, index) in props.links" :key="item.path"
          :style="{ '--index': index, '--count': props.links?.length }">
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

const props = defineProps<{
  links?: { path: string; class?: string, name: string }[]
  name: string
  description?: string
  messages: string[]
  headerColor?: string[]
  emojis?: {
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

const hideMenu = ref(false);

const noMenu = computed(() => {
  return (props.links?.length ?? 0) > 0
})

const computedName = useState('computedName', () => {
  if (!props.name) {
    return;
  }
  else if (!props.withEmoji) {
    return props.name;
  }

  const n = props.name.split(' ')

  if (n.length > 1) {
    n.splice(1, 0, random((props.options.isBirthday ? props.emojis?.birthday : props.emojis?.normal) ?? []))
  }

  return n.join(' ')
})

const circleColor = computed(() => {
  return props.headerColor || undefined
})

const { isLoading: pulse } = useLoadingIndicator();
</script>

<style scoped>
.header {
  height: 238px;
  --uno: overflow-hidden flex items-center flex-col text-center pt-2 relative flex-shrink-0;
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
  position: relative;
  width: 600px;
  top: -35px;
}

.title-header {
  transition: all 0.3s;
  position: absolute;
  inset: 0;
  width: 100%;
  --uno: text-2xl font-serif font-900 flex items-center justify-center;
}

@screen md {
  .title-header {
    --uno: text-2xl;
  }
}

.subtitle-header {
  position: absolute;
  top: 8px;
  width: 100%;
  --uno: uppercase font-500 flex items-center justify-center;
}

.subtitle-header.level-1 {
  --uno: text-xs;
}

.subtitle-header.level-2 {
  --uno: text-[12px];
}

@screen md {
  .subtitle-header.level-1 {
    --uno: text-xl;
  }

  .subtitle-header.level-2 {
    --uno: text-xs;
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
  position: absolute;
  bottom: 0px;
  height: 35px;
  transition: all 300ms ease;
  --uno: font-serif text-gray-900;
}

.navigation.hidden {
  height: 0;
  opacity: 0;
}

ul {
  --uno: flex m-0 p-0 list-none;
}

ul li {
  --uno: leading-none align-middle w-18;

  --mid: calc(round(down, var(--count) / 2));
  --delta: calc(var(--index) - var(--mid));

  transform: rotateZ(calc(-13deg * var(--delta))) translate(calc(2px * var(--delta)), calc(min((8px * var(--delta)), (8px * var(--delta)) * -1)));
  transform-origin: rotate(calc(150% * var(--delta))) 0%;
}

ul a {
  --uno: block mx-2 my-1 rounded-full transition-all;
  position: relative;
}

ul a:after {
  content: '';
  position: absolute;
  inset: 0;
  height: 10px;
  top: 10px;
  border-radius: 100%;
  pointer-events: none;
  transition: all 300ms ease;
  filter: blur(5px);
  z-index: -1;
}

ul a:hover:after,
ul a:focus-visible:after {
  background-color: rgba(0, 0, 0, 0.2);
}

ul a::before {
  content: '';
  position: absolute;
  transition: all 300ms ease;
  inset: 10%;
  bottom: -6px;
  top: auto;
  height: 2px;
}

ul a.router-link-active::before {
  --uno: bg-gray-600 rounded-full pointer-events-none -z-1;
}
</style>