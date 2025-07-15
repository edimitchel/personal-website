<template>
  <header class="header">
    <CircleBackground class="background" :color="circleColor" :pulse="pulse" :image="headerCover" />
    <div class="icons-bottom">
      <SocialIcon v-if="options.github" platform="github" :username="options.github" />
      <SocialIcon v-if="options.linkedin" platform="linkedin" :username="options.linkedin" />
    </div>
    <NuxtLinkLocale to="/" class="logo">
      <Transition name="fade">
        <img v-if="headerImage" :key="headerImage.src" :src="headerImage.src" :alt="headerImage.title">
      </Transition>
    </NuxtLinkLocale>
    <div class="titles">
      <CurvedText :key="computedName" class="title-header" :alone="messages.length === 0"> {{
        computedName }}</CurvedText>
      <MessageCarousel transition-name="balance" :list="messages" #default="{ message, level = 2 }">
        <CurvedText :key="message" :title-level="level" class="subtitle-header">
          {{ message }}
        </CurvedText>
      </MessageCarousel>
    </div>

    <nav class="navigation" v-if="noMenu || hideMenu" :class="{ hidden: hideMenu }">
      <ul>
        <li v-for="(item, index) in props.links" :key="item.path"
          :style="{ '--index': index, '--count': props.links?.length }">
          <NuxtLinkLocale :to="item.path" :class="item.class">
            {{ item.name }}
          </NuxtLinkLocale>
        </li>
        <SwitchLocalePathLink :locale="locale === 'fr' ? 'en' : 'fr'" class="lang-switcher" :class="{ 'disabled': store.notTranslated }"
          :title="store.notTranslated ? $t('header.switchLanguageNotTranslated') : $t('header.switchLanguage')">
          <Transition mode="out-in" name="fade">
            <UnoIcon :key="locale"
              :class="locale === 'fr' ? 'i-noto-v1-flag-for-flag-france' : 'i-noto-v1-flag-for-flag-united-kingdom'" />
          </Transition>
        </SwitchLocalePathLink>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import type { LayoutHeaderProps } from '~/layouts/default.vue'
import { random } from '~/utils'
import { useI18n } from 'vue-i18n'
import { UnoIcon } from '#components'

const { locale } = useI18n()

const store = layoutStore()

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
  --uno: overflow-hidden flex items-center flex-col text-center relative pt-2 flex-shrink-0 z-50;
}

@media screen and (min-height: 400px) {
  .header {
    --uno: sticky;
    top: -143px;
  }
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

.icons-bottom,
.icons-top {
  max-width: 140px;
  --uno: flex justify-between absolute w-full;
}

.icons-top {
  z-index: 200;
}

.icons-bottom {
  top: 120px;
}

.titles {
  height: 60px;
  z-index: -1;
  position: relative;
  width: 600px;
  top: -30px;
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
  --uno: text-sm;
}

.subtitle-header.level-2 {
  --uno: text-xs;
}

@screen md {
  .subtitle-header.level-1 {
    --uno: text-lg;
  }

  .subtitle-header.level-2 {
    --uno: text-sm;
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
  --uno: leading-none align-middle w-20;

  --mid: calc(round(down, var(--count) / 2));
  --delta: calc(var(--index) - var(--mid));

  transform: rotateZ(calc(-12.7deg * var(--delta))) translate(calc(-6px * var(--delta)), calc(min((9.7px * var(--delta)), (9.7px * var(--delta)) * -1)));
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
  transition: all 200ms ease;
  filter: blur(4px);
  z-index: -1;
}

ul a:hover:after,
ul a:focus-visible:after {
  background-color: rgba(0, 0, 0, 0.15);
}

ul a::before {
  content: '';
  position: absolute;
  transition: all 200ms ease;
  inset: 10%;
  bottom: -7px;
  top: auto;
  height: 2px;
  border-radius: 0 0 80% 80%;
}

ul a.router-link-active::before {
  --uno: bg-gray-600 pointer-events-none -z-1 bottom-[-6px];
}

.header :deep(a.lang-switcher) {
  --uno: absolute text-xl flex w-8 justify-center pt-1 rounded-tl-full rounded-tr-full bg-white bg-opacity-50;
  top: -23.5px;
  left: 95%;
  rotate: -22.5deg;
  transition: all 400ms ease;
}

.header :deep(a.lang-switcher.disabled) {
  --uno: absolute filter-saturate-0 opacity-50;
}

@screen md {
  .header :deep(a.lang-switcher) {
    rotate: -27deg;
    top: -34.5px;
    left: 105%;
  }
}
</style>