<template>
  <NuxtRouteAnnouncer />
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
  min-height: 100lvh;
  display: flex;
  flex-direction: column;
  position: relative;
}

#app::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 100%;
  mask-image: linear-gradient(to right, transparent -10%, white 20%, white 80%, transparent 110%);
  transition: background-color 300ms ease;
  z-index: -1;
  --uno: bg-opacity-80 bg-foreground;
}

@screen md {
  #app::after {
    mask-image: linear-gradient(to right, transparent 0%, white 30%, white 70%, transparent 100%);
  }
}

@media screen and (prefers-reduced-motion: reduce) {
  #app::after {
    display: none;
  }
}
</style>