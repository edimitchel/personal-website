<template>
  <header>
    <circle-background class="background" :color="circleColor" :pulse="pulse" />
    <div class="icons">
      <twitter-icon v-if="options.twitter" :url="options.twitter" />
      <github-icon v-if="options.github" :url="options.github" />
    </div>
    <nuxt-link
      :to="path()"
      class="logo"
    >
      <img
        :src="headerImage"
        alt="Michel's picture"
      >
    </nuxt-link>
    <div class="titles">
      <transition mode="out-in" name="fade">
        <curved-text
          :key="computedName"
          class="title-header"
          :class="{ alone: !message.length }"
          :text-style="!message.length ? 'letter-spacing: 3px' : ''"
        >
          {{ computedName }}
        </curved-text>
      </transition>
      <no-ssr>
        <message-carousel
          :data-list="message"
        >
          <template
            slot-scope="{ data }"
          >
            <curved-text
              :key="data"
              title-level="2"
              class="subtitle-header"
            >
              {{ data }}
            </curved-text>
          </template>
        </message-carousel>
      </no-ssr>
    </div>

    <transition name="up">
      <nav v-if="links.length > 0 && !hideMenu">
        <n-link
          v-for="item in links"
          :key="item.path"
          :to="path(item.path)"
          :class="item.class"
        >
          {{ item.title }}
        </n-link>
      </nav>
    </transition>
  </header>
</template>
<script>
import { random } from '@@/utils'
import CircleBackground from '@/components/CircleBackground'
import GithubIcon from '@/components/GithubIcon'
import TwitterIcon from '@/components/TwitterIcon'
import MessageCarousel from '@/components/MessageCarousel'
import CurvedText from '@/components/CurvedText'

const defaultImage = require('~/assets/images/self-image.png')

export default {
  name: 'Header',
  components: {
    CircleBackground,
    GithubIcon,
    TwitterIcon,
    CurvedText,
    MessageCarousel
  },
  props: {
    links: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: 'Description'
    },
    message: {
      type: Array,
      default: () => []
    },
    headerColor: {
      type: String,
      default: ''
    },
    headerImage: {
      type: String,
      default: defaultImage
    },
    emojis: {
      type: Object,
      default: () => ({
        birthday: [],
        normal: []
      })
    },
    options: {
      type: Object,
      default: () => ({
        github: '',
        isBirthday: false,
        twitter: ''
      })
    },
    withEmoji: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pulse: false,
      counter: {}
    }
  },
  computed: {
    hideMenu() {
      return this.$store.state.layout.hideMenu
    },
    computedName() {
      if (!this.name) {
        return
      } else if (this.withEmoji) {
        return this.name
      }
      const n = this.name.split(' ')
      if (this.options.isBirthday) {
        n.splice(1, 0, random(this.emojis.birthday))
      } else {
        n.splice(1, 0, random(this.emojis.normal))
      }
      return n.join(' ')
    },
    circleColor() {
      return this.headerColor || undefined
    }
  },
  methods: {
    stopPulse() {
      this.pulse = false
    },
    path(path) {
      const { lang } = this.$route.params
      return { path: '/' + lang + '/' + (path ? path + '/' : '') }
    }
  }
}
</script>
<style>
.logo {
  width: 150px;
  min-width: 150px;
  height: 150px;
  border-radius: 100%;
  cursor: pointer;
  z-index: 100;
  overflow: hidden;
  transition: all 150ms ease;
}
.logo:hover {
  transform: scale(0.95);
}

header {
  @apply me-overflow-hidden
      me-flex
      me-items-center
      me-flex-col
      me-text-center
      me-pt-3;
}
.icons {
  max-width: 200px;
  top: 130px;
  @apply me-flex
      me-justify-between
      me-absolute
      me-w-full;
}
.titles {
  height: 80px;
  margin-top: -15px;
}
.title-header {
  transition: all 0.3s;
  position: relative;
  top: 0;
  margin-top: -15px;
  @apply me-text-xl
      me-font-mono
      me-font-bold;
}
.title-header.alone {
  top: 10px;
}
@screen md {
  .title-header {
    @apply me-text-3xl;
  }
}
.subtitle-header {
  margin-top: -60px;
  @apply me-text-xs;
}
@screen md {
  .subtitle-header {
    @apply me-text-base;
  }
}
.background {
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  @apply me-absolute;
}

nav {
  @apply me-flex
      me-uppercase;
}
nav a {
  @apply me-m-4
      me-text-gray-900
      me-p-2
      me-rounded
      me-leading-none
      me-align-middle
      me-no-underline;
}
nav a:first-child {
  transform: rotateZ(13deg) translateY(-10px);
}
nav a:last-child {
  transform: rotateZ(-11.5deg) translateY(-10px);
}
nav a.blog {
  transition: all 0.3s ease;
  @apply me-text-blue-500
      me-font-bold;
}
nav a:hover,
nav a:focus {
  @apply me-bg-gray-500
      me-text-white;
}
nav a.nuxt-link-active {
  @apply me-bg-gray-900
      me-text-white;
}
nav a.blog.nuxt-link-active {
  @apply me-bg-blue-500
      me-font-bold
      me-text-white;
}
</style>
