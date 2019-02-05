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
} = process.env.appOptions

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
}
</style>
