<template>
  <div>
    <Header
      :links="navLinks"
      :name="customPageName || title"
      :with-emoji="!!customPageName"
      :description="description"
      :message="message"
      :header-color="headerColor"
      :emojis="emojis"
      :options="options"
    />
    <main class="container mx-auto">
      <nuxt v-if="!$slots.default" />
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const { emojis, title, description, navLinks, ...options } = process.env.app

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
      options: {
        ...options.references
      }
    }
  },
  computed: {
    customPageName() {
      return this.$store.state.layout.pageName
    },
    message() {
      return this.$store.state.layout.message
    },
    headerColor() {
      return this.$store.state.layout.color
    }
  }
}
</script>

<style lang="postcss">
  .container {
    @apply
      me-px-4
      me-border-0
      me-mx-auto
      me-font-sans
  }

  @screen md {
    .container {
      max-width: theme('screens.lg');
      @apply
        me-p-16
        me-pt-8
    }
  }

  .fade-enter-active, .fade-leave-active, .appear {
    transition: all 200ms ease;
    position: relative;
    top: 0;
  }

  .fade-enter-to {
    transition-delay: 150ms;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
    top: -5px;
  }

  .up-enter-active, .up-leave-active, .appear {
    transition: opacity 300ms ease, top 400ms ease;
    position: relative;
    top: 0;
  }

  .up-leave-to {
    transition-delay: 200ms;
  }

  .up-enter, .up-leave-to {
    opacity: 0;
    top: -5px;
    z-index: -1;
  }
</style>
