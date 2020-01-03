<template>
  <header>
    <circle-background class="background" :color="circleColor" :pulse="pulse" :image="headerCover" />
    <div class="icons">
      <twitter-icon v-if="options.twitter" :url="options.twitter" />
      <github-icon v-if="options.github" :url="options.github" />
    </div>
    <nuxt-link :to="path()" class="logo">
      <transition name="fade">
        <img v-show="headerImage" :key="headerImage.src" :src="headerImage.src" :alt="headerImage.title" />
      </transition>
    </nuxt-link>
    <div class="titles">
      <transition mode="out-in" name="fade">
        <curved-text
          :key="computedName"
          class="title-header"
          :class="{ alone: !message.length }"
          :text-style="!message.length ? 'letter-spacing: 3px' : ''"
        >{{ computedName }}</curved-text>
      </transition>
      <client-only>
        <message-carousel :data-list="message">
          <template slot-scope="{ data }">
            <curved-text :key="data" title-level="2" class="subtitle-header">{{ data }}</curved-text>
          </template>
        </message-carousel>
      </client-only>
    </div>

    <transition name="up">
      <nav v-if="noMenu || hideMenu" :class="{ hidden: hideMenu }">
        <ul>
          <li v-for="item in links" :key="item.path">
            <n-link :to="path(item.path)" :class="item.class">{{ item.name }}</n-link>
          </li>
        </ul>
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
    headerImage() {
      return this.$store.state.layout.headerImage
    },
    headerCover() {
      return this.$store.state.layout.headerCover
    },
    hideMenu() {
      return this.$store.state.layout.hideMenu
    },
    noMenu() {
      return this.links.length > 0
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
<style scoped lang="postcss">
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
  @apply overflow-hidden
    flex
    items-center
    flex-col
    text-center
    pt-3;
}
.icons {
  max-width: 200px;
  top: 130px;
  @apply flex
    justify-between
    absolute
    w-full;
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
  margin-top: -15px;
  @apply text-xl
    font-mono
    font-bold;
}
.title-header.alone {
  top: 10px;
}
@screen md {
  .title-header {
    @apply text-3xl;
  }
}
.subtitle-header {
  margin-top: -60px;
  @apply text-xs;
}
@screen md {
  .subtitle-header {
    @apply text-base;
  }
}
.background {
  top: 0;
  left: 0;
  right: 0;
  z-index: -1;
  @apply absolute;
}

nav {
  height: 40px;
  transition: all 300ms ease;
  @apply uppercase
    mt-4;
}
nav.hidden {
  height: 0;
  opacity: 0;
}
ul {
  @apply flex
    m-0
    p-0
    list-none;
}
ul li {
  @apply p-2
    rounded
    leading-none
    align-middle
    no-underline;
}
ul a {
  @apply m-4
    text-gray-900
    p-2
    rounded
    leading-none
    align-middle
    no-underline;
}
ul a.blog {
  transition: all 0.3s ease;
  @apply text-blue-500
    font-bold;
}
ul a:hover,
ul a:focus {
  @apply bg-gray-500
    text-white;
}
ul a.nuxt-link-active {
  @apply bg-gray-600
    text-white;
}
ul a.blog.nuxt-link-active {
  @apply bg-blue-500
    font-bold
    text-white;
}
</style>
