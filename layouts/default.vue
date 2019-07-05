<template>
  <div>
    <Header
      :links="info.navLinks"
      :name="customPageName || info.title"
      :with-emoji="!!customPageName"
      :description="info.description"
      :message="message"
      :header-color="headerColor"
      :emojis="info.emojis"
      :options="info.references"
    />
    <main class="container mx-auto">
      <nuxt v-if="!$slots.default" />
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default {
  components: {
    Footer,
    Header
  },
  computed: {
    ...mapGetters('informations', {
      info: 'get'
    }),
    ...mapState('layout', {
      customPageName: 'pageName',
      message: 'message',
      headerColor: 'color'
    })
  },
  mounted() {
    const { lang } = this.$route.params
    this.setCurrentLang(lang)
  },
  methods: {
    ...mapActions('informations', ['setCurrentLang'])
  }
}
</script>

<style lang="postcss">
.container {
  @apply me-px-4
      me-border-0
      me-mx-auto
      me-font-sans;
}

@screen md {
  .container {
    max-width: theme('screens.lg');
    @apply me-p-16
        me-pt-8;
  }
}

.fade-enter-active,
.fade-leave-active,
.appear {
  transition: all 200ms ease;
  position: relative;
  top: 0;
}

.fade-enter-to {
  transition-delay: 150ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  top: -5px;
}

.up-enter-active,
.up-leave-active,
.appear {
  transition: opacity 300ms ease, top 400ms ease;
  position: relative;
  top: 0;
}

.up-leave-to {
  transition-delay: 200ms;
}

.up-enter,
.up-leave-to {
  opacity: 0;
  top: -5px;
  z-index: -1;
}
</style>
