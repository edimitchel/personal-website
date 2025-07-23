<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
html {
  --uno: transition-colors duration-200;
}
html.dark-mode {
  background-color: #000;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
#app::after {
  content: '';
  --uno: transition-all duration-300;
  background: linear-gradient(to right, transparent 0%, white, transparent);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.dark-mode #app::after {
  background: linear-gradient(to right, transparent 0%, #333, transparent);
}
</style>