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
  background: linear-gradient(to right, transparent -10%, var(--colors-foreground), transparent 110%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>