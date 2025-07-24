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
  min-height: 100vh;
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
  background: linear-gradient(to right, transparent -10%, var(--colors-foreground), transparent 110%);
  transition: background-color 300ms ease;
  z-index: -1;
}

@media screen and (max-width: 1024px) {
  #app::after {
    background: linear-gradient(to right, transparent 10%, var(--colors-foreground), transparent 90%);
  }
}
</style>