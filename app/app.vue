<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
html {
  --uno: transition-colors duration-300;
}
html.dark-mode {
  background-color: #000;
}

#app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
}

#app::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  mask: linear-gradient(to right, transparent -10%, white, transparent 110%);
  backdrop-filter: blur(10px);
  background-color: var(--colors-foreground);
  transition: background-color 300ms ease;
  z-index: -1;
}

@media screen and (prefers-reduced-motion: reduce) {
  #app::after {
    display: none;
  }
}
</style>