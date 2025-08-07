<script lang="ts" setup>
import defaultImage from '~/assets/images/self-image.jpeg'

defineProps<{
  title: string,
  description: string,
  headline?: string,
  image?: string,
}>();
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center bg-black">
    <svg class="absolute top-0 right-0" width="1200" height="675" viewBox="0 0 1200 675" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g style="mix-blend-mode:overlay" opacity="0.7" filter="url(#filter0_f_448_25)">
        <circle cx="175" cy="300" r="400" fill="white" />
        <circle cx="175" cy="300" r="250" fill="#777" />
      </g>
      <defs>
        <filter id="filter0_f_448_25" x="-240" y="-374" width="1561" height="1111" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="110" result="effect1_foregroundBlur_448_25" />
        </filter>
      </defs>
    </svg>
    
    <img class="absolute top-[175px] left-[50px] object-contain" width="250" height="250" :src="image ?? defaultImage" />

    <div class="w-full pl-[350px] pr-[50px] text-white">
      <p v-if="headline" class="uppercase text-[24px] mb-4 font-semibold">
        {{ headline }}
      </p>
      <h1 class="w-full m-0 text-[55px] font-semibold mb-4" style="display:block; line-clamp: 2; text-overflow: ellipsis;">
        {{ title }}
      </h1>
      <p class="text-[32px] text-[#E4E4E7] leading-tight" style="display:block; line-clamp: 3; text-overflow: ellipsis;">
        {{ description }}
      </p>
    </div>

  </div>
</template>