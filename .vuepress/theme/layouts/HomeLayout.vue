<template>
  <div class="text-center">Home
    <Cards/>
  </div>
</template>

<script>
import Cards from "../components/Cards.vue";

export default {
  components: { Cards },
  name: "HomeLayout"
};
</script>