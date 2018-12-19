<template>
  <main>
    <Content/>
  </main>
</template>

<script>
import CurvedText from '@components/CurvedText';
import CircleBackground from '@components/CircleBackground';

export default {
  name: "HomeLayout",
};
</script>
<style lang="stylus" scoped>
@css {
  main {
  }
  h1 {
    @apply me-pb-5;
  }
}
</style>