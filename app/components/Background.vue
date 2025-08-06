<template>
  <div class="background-container"></div>
</template>
<style scoped>
.background-container {
  --uno: absolute top-0 left-0 w-full h-full -z-1 opacity-20 transition-opacity duration-800 ease-out;

  background-image: radial-gradient(circle, var(--colors-background) 1.5px, transparent 1.5px);
  background-size: 30px 30px;
  background-position: center top;
  animation: fadeIn 1s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: .2;
  }
}
</style>
