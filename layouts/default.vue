<template>
  <div>
    <Header
      :links="navLinks"
      :name="title"
      :description="description"
      :message="message"
      :header-color="headerColor"
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
      headerColor: '',
      emojis,
      title,
      description,
      navLinks,
      options: ({
        ...options.references
      })
    }
  },
  computed: {
    message() { return this.$store.state.layout.message },
    headerColo() { return this.$store.state.layout.color }
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

  .fade-enter-active, .fade-leave-active {
    transition: all 150ms ease;
    position: relative;
  }

  .fade-enter {
    opacity: 0;
    top: -10px;
  }

  .fade-leave,
  .fade-enter-to {
    opacity: 1;
    top: 0;
  }

  .fade-leave-to {
    opacity: 0;
    top: 10px;
  }
}
</style>
