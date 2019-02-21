<template>
  <div>
    <Header
      :links="navLinks"
      :name="title"
      :description="description"
      :emojis="emojis"
      :options="options"
    />
    <main class="main-content">
      <nuxt v-if="!$slots.default" />
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const {
  emojis,
  title,
  description,
  navLinks,
  ...options
} = process.env.app

export default {
  components: {
    Footer,
    Header
  },
  data() {
    return {
      emojis,
      title,
      description,
      navLinks,
      options: ({
        ...options.references
      })
    }
  }
}
</script>

<style lang="stylus">
@css {
  body {
    @apply me-font-mono;
  }
  .main-content {
    max-width: config(screens.md);
    @apply me-p-4 me-border-0 me-mx-auto;
  }
  @screen md {
    .main-content {
      max-width: config(screens.lg);
    }
  }

  @screen md {
    .main-content {
      @apply me-p-16 me-pt-8;
    }
  }

  .right-enter-active, .right-leave-active {
    transition: all .3s;
    position: relative;
  }

  .right-enter {
    opacity: 0;
    left: 10px;
  }

  .right-leave,
  .right-enter-to {
    opacity: 1;
    left: 0;
  }

  .right-leave-to {
    opacity: 0;
    left: -10px;
  }
}
</style>
