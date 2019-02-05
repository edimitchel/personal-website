<template>
  <header>
    <circle-background class="background" :color="circleColor" :pulse="pulse" />
    <div class="icons">
      <twitter-icon v-if="options.twitter" :url="options.twitter" />
      <github-icon v-if="options.github" :url="options.github" />
    </div>
    <img
      src="~assets/images/self-image.jpg"
      alt="Michel's picture"
      class="logo"
      @click="goHome"
    >
    <curved-text class="title-header">
      {{ name }}
    </curved-text>
    <transition
      appear
      appear-class="appear"
      appear-to-class="appear-active"
      mode="out-in"
      name="fade"
    >
      <curved-text v-show="computedMessage" :key="computedMessage" class="subtitle-header">
        {{ computedMessage }}
      </curved-text>
    </transition>

    <nav v-if="links.length > 0">
      <n-link
        v-for="item in links"
        :key="item.path"
        :to="item.path"
        :class="item.class"
        exact
      >
        {{ item.title }}
      </n-link>
    </nav>
  </header>
</template>
<script>
import { randomEmoji } from '@@/utils'
import CircleBackground from '@/components/CircleBackground'
import GithubIcon from '@/components/GithubIcon'
import TwitterIcon from '@/components/TwitterIcon'
import CurvedText from '@/components/CurvedText'

export default {
  name: 'Header',
  components: {
    CircleBackground,
    GithubIcon,
    TwitterIcon,
    CurvedText
  },
  props: {
    links: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: 'Main menu'
    },
    description: {
      type: String,
      default: 'Description'
    },
    message: {
      type: [Array, String],
      default: () => [
        ''
      ]
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
    }
  },
  data() {
    return {
      pulse: false,
      counter: {}
    }
  },
  computed: {
    computedName() {
      const name = this.name
      if (!name) {
        return
      }
      const n = name.split(' ')

      if (this.options.isBirthday) {
        n.splice(1, 0, randomEmoji(this.emoji.birthday))
      } else {
        n.splice(1, 0, randomEmoji(this.emoji.normal))
      }

      return n.join(' ')
    },
    computedMessage() {
      const message = this.message

      if (Array.isArray(message)) {
        return message[Math.floor(message.length * Math.random())]
      }
      return message
    },
    circleColor() {
      return this.headerColor || undefined
    }
  },
  methods: {
    stopPulse() {
      this.pulse = false
    },
    goHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style lang="stylus" scoped>
.logo {
  width: 150px;
  min-width: 150px;
  height: 150px;
  border-radius: 100%;
  cursor: pointer;
  z-index: 100;
}

.fade-enter-active, .fade-leave-active, .appear {
  transition: all 200ms ease;
  position: relative;
  top: 0;
}

.fade-enter-to {
  transition-delay: 200ms;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  top: -5px;
}

@css {
  header {
    @apply
      me-overflow-hidden
      me-flex
      me-items-center
      me-flex-col
      me-text-center
      me-pt-3
  }
  .icons {
    max-width: 200px;
    top: 130px;
    @apply
      me-flex
      me-justify-between
      me-absolute
      me-w-full
  }
  .title-header {
    margin-top: -15px;
    @apply
      me-text-xl
      me-font-mono
      me-font-bold
  }
  @screen md {
    .title-header {
      @apply
        me-text-3xl
    }
  }
  .subtitle-header {
    margin-top: -65px;
    @apply
      me-text-xs
  }
  @screen md {
    .subtitle-header {
      @apply
        me-text-base
    }
  }
  .background {
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    @apply
      me-absolute
  }

  nav {
    @apply
      me-flex
      me-uppercase
  }
  nav a {
    @apply
      me-m-4
      me-text-grey-dark
      me-p-2
      me-rounded
      me-no-underline
  }
  nav a.blog
  {
    transition: all .3s ease;
    @apply
      me-text-blue
      me-font-bold
  }
  nav a:hover, nav a:focus
  {
    @apply
      me-bg-grey
      me-text-white
  }
  nav a.nuxt-link-active
  {
    @apply
      me-bg-grey-dark
      me-text-white
  }
  nav a.blog.nuxt-link-active
  {
    @apply
      me-bg-blue
      me-font-bold
      me-text-white
  }
}
</style>
