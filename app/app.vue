<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}
#app::after {
  content: '';
  background: linear-gradient(to right, transparent, white, transparent);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>