<template>
  <header>
    <circle-background class="background" :color="circleColor" :pulse="pulse"/>
    <div class="icons">
      <twitter-icon url="https://twitter.com/edimitchel"/>
      <github-icon url="https://github.com/edimitchel"/>
    </div>
    <img
      :src="$withBase('/images/self-image.jpg')"
      alt="Michel's picture"
      class="logo"
      @click="goHome"
    >
    <ClientOnly>
      <curved-text class="title-header">{{name}}</curved-text>
      <transition
        appear
        appear-class="appear"
        appear-to-class="appear-active"
        mode="out-in"
        name="fade"
      >
        <curved-text :key="message" class="subtitle-header">{{message ? message : description}}</curved-text>
      </transition>
    </ClientOnly>

    <nav>
      <router-link
        exact
        v-for="item in $site.themeConfig.nav"
        :key="item.link"
        :to="item.link"
        :class="item.class"
      >{{item.text}}</router-link>
    </nav>
  </header>
</template>
<script>
import { debounce } from "debounce";

import { randomEmoji, isBirthday } from "@vpress/utils";

let d;

export default {
  name: "Nav",
  data() {
    return {
      pulse: false,
      counter: {}
    };
  },
  computed: {
    name() {
      const name = this.$site.themeConfig.name;
      const { birthdate } = this.$site.themeConfig;
      let n = name.split(" ");

      if (isBirthday(birthdate)) {
        n.splice(1, 0, randomEmoji(this.$site.themeConfig.emoji.birthday));
      } else {
        n.splice(1, 0, randomEmoji(this.$site.themeConfig.emoji.normal));
      }

      return n.join(" ");
    },
    description() {
      return this.$site.description;
    },
    message() {
      const message = this.$page.frontmatter.message;
      if (Array.isArray(message)) {
        return message[Math.floor(message.length * Math.random())];
      }
      return message;
    },
    circleColor() {
      return this.$page.frontmatter.headerColor || undefined;
    }
  },
  methods: {
    stopPulse: function() {
      this.pulse = false;
    },
    goHome() {
      this.$router.push({ path: "/" });
    }
  },
  mounted() {
    d = debounce(this.stopPulse, 600);
  },
  watch: {
    $page(page) {
      this.pulse = true;
      d && d.clear();
      d();
    }
  }
};
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
  nav a.router-link-active
  {
    @apply
      me-bg-grey-dark
      me-text-white
  }
  nav a.blog.router-link-active
  {
    @apply
      me-bg-blue
      me-font-bold
      me-text-white
  }
}
</style>
