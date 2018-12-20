<template>
  <header>
    <circle-background class="background" :color="circleColor" :pulse="pulse"/>
    <div class="icons">
      <twitter-icon url="https://twitter.com/edimitchel"/>
      <github-icon url="https://github.com/edimitchel"/>
    </div>
    <img :src="$withBase('/images/michel-photo.png')" alt="Michel's picture" class="logo">
    <curved-text class="title-header">Michel Edighoffer</curved-text>
    <ClientOnly>
      <curved-text class="subtitle-header">{{description}}{{message ? ' - ' : ''}}{{message}}</curved-text>
    </ClientOnly>

    <nav>
      <router-link
        exact
        v-for="item in $site.themeConfig.nav"
        :key="item.link"
        :to="item.link"
      >{{item.text}}</router-link>
    </nav>
  </header>
</template>
<script>
import { debounce } from "debounce";
// import {
//   CurvedText,
//   CircleBackground,
//   GithubIcon,
//   TwitterIcon
// } from "@components/index";

let d;

export default {
  name: "Nav",
  components: {
    // CurvedText,
    // CircleBackground,
    // GithubIcon,
    // TwitterIcon
  },
  data() {
    return {
      pulse: false
    };
  },
  computed: {
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
  height: 150px;
  border-radius: 100%;
}

@css {
  header { 
    @apply me-overflow-hidden me-flex me-items-center me-flex-col me-text-center me-pt-5;
  }
  .icons {
    max-width: 200px;
    @apply me-flex me-justify-between me-absolute me-w-full;
  }
  .title-header {
    margin-top: -15px;
    @apply me-text-xl me-font-mono me-font-bold;  
  }
  @screen md {
    .title-header {
        @apply me-text-3xl;
    }
  }
  .subtitle-header {
    margin-top: -65px;
    @apply me-text-xs;  
  }
  @screen md {
    .subtitle-header {
        @apply me-text-base;
    }
  }
  .background {
    @apply me-absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
  }

  nav {
    @apply me-flex;
  
  }
  nav a {
    @apply me-m-4 me-text-grey-dark me-p-2 me-rounded me-no-underline;
  }
  nav a:hover,
nav a:focus,
nav a.router-link-active
  {
    @apply me-bg-grey-dark me-text-white;
  }
}
</style>
