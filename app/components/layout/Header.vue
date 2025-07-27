<template>
  <header class="header">
    <CircleBackground class="background" :color="circleColor" :pulse="pulse" :image="headerCover" />
    <div v-if="headerImage && !headerCover" class="icons-bottom">
      <SocialIcon v-if="options.github" platform="github" :username="options.github" />
      <SocialIcon v-if="options.linkedin" platform="linkedin" :username="options.linkedin" />
    </div>
    <NuxtLinkLocale to="/" class="logo">
      <Transition name="fade">
        <img v-if="headerImage && !headerCover" :key="headerImage.src" :src="headerImage.src" :alt="headerImage.title">
      </Transition>
    </NuxtLinkLocale>
    <div class="titles">
      <Transition name="fade" mode="out-in" v-if="computedName">
        <CurvedText :key="computedName" class="title-header" :alone="messages.length === 0" :text="computedName" />
      </Transition>
      <MessageCarousel transition-name="balance" :list="messages" #default="{ message, level = 2 }">
        <CurvedText v-if="message" :key="message" :title-level="level" class="subtitle-header" :text="message" />
      </MessageCarousel>
    </div>

    <ClientOnly>
      <nav class="navigation" v-if="noMenu || hideMenu" :class="{ hidden: hideMenu }">
        <ul>
          <SwitchLocalePathLink :locale="locale === 'fr' ? 'en' : 'fr'" class="lang-switcher"
            :class="{ 'disabled': store.notTranslated }"
            :title="store.notTranslated ? $t('header.switchLanguageNotTranslated') : $t('header.switchLanguage')">
            <Transition mode="out-in" name="fade">
              <UnoIcon :key="locale"
                :class="locale === 'fr' ? 'i-noto-v1-flag-for-flag-france' : 'i-noto-v1-flag-for-flag-united-kingdom'" />
            </Transition>
          </SwitchLocalePathLink>
          <button class="mode-switcher" @click="cycleModes">
            <Transition name="fade" mode="out-in">
              <UnoIcon v-if="mode.preference === 'dark'" key="dark" class="i-line-md-lightbulb-off-twotone" />
              <UnoIcon v-else-if="mode.preference === 'light'" key="light" class="i-line-md-lightbulb-twotone" />
              <UnoIcon v-else key="system" class="i-line-md-light-dark" />
            </Transition>
          </button>

          <li v-for="(item, index) in props.links" :key="item.path"
            :style="{ '--index': index, '--count': props.links?.length }">
            <NuxtLinkLocale :to="item.path" :class="item.class">
              {{ item.name }}
            </NuxtLinkLocale>
          </li>

          <button class="contact-button" @click="contactVisible = !contactVisible">
            <UnoIcon class="i-line-md-chat-round-dots" />
          </button>
          <Teleport to="#modals">
            <div v-if="contactVisible" class="fixed w-100vw h-100vh inset-0 p-10 backdrop-blur-sm z-110" @click.self="contactVisible = false">
              <UnoIcon class="i-line-md-close absolute text-xl top-5 right-10 cursor-pointer text-background" @click="contactVisible = false" />
              <ContactForm :isVisible="contactVisible" @update:isVisible="contactVisible = $event" class="text-background">
              </ContactForm>
            </div>
          </Teleport>
        </ul>
      </nav>
    </ClientOnly>
  </header>
</template>

<script setup lang="ts">
import type { LayoutHeaderProps } from '~/layouts/default.vue'
import type { MessageObject } from '~/stores/layout'
import { random } from '~/utils'
import { useI18n } from 'vue-i18n'
import { UnoIcon } from '#components'

const { locale } = useI18n()

const mode = useColorMode();

const contactVisible = ref(false)

const store = layoutStore()

const props = defineProps<{
  links?: { path: string; class?: string, name: string }[]
  description?: string
  messages: (string | MessageObject)[]
  headerColor?: string[]
  emojis?: {
    birthday: string[]
    normal: string[]
  }
  options: LayoutHeaderProps['options'],
  withEmoji: boolean
}>()

const cycleCount = ref(0)

const cycleModes = () => {
  const modes = ['dark', 'light']
  const index = modes.indexOf(mode.value)
  if (mode.preference !== 'system') {
    cycleCount.value++
  }
  if (mode.preference !== 'system' && cycleCount.value >= 2) {
    mode.preference = 'system'
    cycleCount.value = 0
  } else {
    mode.preference = modes[(index + 1) % modes.length]!
  }
}

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

const computedName = computed(() => {
  const title = store.title;
  if (!title) {
    return;
  }
  else if (!props.withEmoji) {
    return title;
  }

  const splitTitle = title.split(' ')

  if (splitTitle.length > 1) {
    splitTitle.splice(1, 0, random((props.options.isBirthday ? props.emojis?.birthday : props.emojis?.normal) ?? []))
  }

  return splitTitle.join(' ')
})

const circleColor = computed(() => {
  return props.headerColor || undefined
})

const { isLoading: pulse } = useLoadingIndicator();
</script>

<style scoped>
.header {
  height: 238px;
  --uno: overflow-hidden flex items-center flex-col text-center relative pt-2 flex-shrink-0 z-50 text-background transition-colors duration-200;
}

@media screen and (min-height: 400px) and (min-width: 1024px) {
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

.logo img {
  height: 100%;
  object-fit: contain;
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
  top: -20px;
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
  top: 7px;
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
  --uno: font-serif text-background transition-colors duration-200;
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
  --uno: bg-primary-600 pointer-events-none -z-1 bottom-[-6px];
}

.mode-switcher,
.contact-button,
:deep(a.lang-switcher) {
  --uno: absolute text-sm flex w-6 h-6 items-center justify-center rounded-full rounded-tr-full bg-primary-400/20 hover:bg-primary/40 cursor-pointer;
  bottom: 45px;
  right: 90%;
  rotate: 21.5deg;
  transition: all 400ms ease;
}

@screen md {
  .mode-switcher {
    --uno: text-lg w-8 h-8;
    bottom: 55px;
    right: 100%;
    rotate: 21.5deg;
  }
}

.contact-button {
  --uno: text-lg;
  bottom: 45px;
  left: 92%;
  rotate: -22.5deg;
  transition: all 400ms ease;
}

.contact-button>* {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@screen md {
  .contact-button {
    --uno: text-2xl w-8 h-8;
    bottom: 52px;
    left: 100%;
    rotate: -23.5deg;
  }
}

:deep(a.lang-switcher) {
  bottom: 58px;
  right: 103%;
  rotate: 30deg;
}

:deep(a.lang-switcher.disabled) {
  --uno: absolute filter-saturate-0 opacity-50 text-xl;
}

@screen md {
  :deep(a.lang-switcher) {
    --uno: text-xl w-8 h-8;
    bottom: 70px;
    right: 113%;
    rotate: 34deg;
  }
}
</style>