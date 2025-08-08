<template>
  <div ref="containerRef" class="h-[280px] md:h-[250px]">
    <div class="carousel absolute overflow-hidden inset-x-0 py-4 mb-4 w-full" :style="{
      maxWidth: maxWidth ? `${maxWidth}px` : '100%'
    }">
      <div class="relative w-full min-h-[170px]" v-on="sliderEvents">
        <div v-if="!isInitialized" class="absolute inset-0 flex items-center justify-center text-center">
          <div class="text-primary-600 animate-pulse">{{ $t('carousel.loading') }}...</div>
        </div>
        <Motion v-if="isInitialized" tag="div" class="flex" drag="x" :dragConstraints="dragConstraints" :style="{
          gap: `${GAP}px`,
          x: motionX,
        }" @dragEnd="handleDragEnd"
          :animate="{ x: -(currentIndex * trackItemOffset) + (viewportWidth / 2 - (itemWidth) / 2) }"
          :transition="SPRING_OPTIONS" @animationComplete="handleAnimationComplete">
          <Motion v-for="(item, index) in carouselItems" :key="index" tag="div" :class="[
            'relative shrink-0 flex flex-col cursor-grab active:cursor-grabbing min-h-[150px]',
            'items-start justify-between bg-foreground shadow-sm shadow-primary/40 rounded-lg p-2',
            'transition-opacity duration-500'
          ]" :style="{
            width: itemWidth > 0 ? `${itemWidth}px` : '100%',
            height: '100%',
          }" :transition="SPRING_OPTIONS">
            <div v-if="!$slots.default" class="p-1 text-primary-900">
              <div class="mb-1 font-black text-lg">{{ item.title }}</div>
              <p class="text-sm">{{ item.description }}</p>
              <div class="my-4" v-if="item.icons">
                <span class="flex gap-2 items-center">
                  <i v-for="icon in Array.isArray(item.icons) ? item.icons : [item.icons]" :key="icon" :class="icon"
                    class="text-foreground text-xl"></i>
                </span>
              </div>
            </div>
            <slot v-else :item="item" />
          </Motion>
        </Motion>
      </div>

      <div v-if="isInitialized" class="flex w-full justify-center pt-4 gap-2">
        <Motion v-for="(_, index) in items" :key="index" tag="div" :class="[
          'h-3 w-3 rounded-full transition-colors duration-150 border border-primary-600 cursor-pointer',
          currentIndex % items.length === index
            ? 'bg-primary-600'
            : 'bg-primary-100'
        ]" @click="() => setCurrentIndex(index)" :transition="{ duration: 0.15 }" />
        <Transition name="fade" mode="out-in">
          <button :key="isAutoplaying ? 'pause' : 'play'"
            @click="() => isAutoplaying ? stopAutoplay() : startAutoplay()" class="block w-3 h-3 cursor-pointer ring-1 ring-primary-600">
            <UnoIcon class="w-3 h-3" :class="isAutoplaying ? 'i-ic-baseline-pause' : 'i-ic-baseline-play-arrow'" />
          </button>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export interface CarouselItem {
  id: string;
  title: string;
  description: string;
  icons?: string | string[];
  [key: string]: any;
}

export interface CarouselProps {
  items?: CarouselItem[];
  maxWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
}
</script>

<script setup lang="ts">
import { Motion, useMotionValue } from 'motion-v';
import { useTemplateRef } from 'vue';

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30, bounce: 0 };

const props = withDefaults(defineProps<CarouselProps>(), {
  items: () => [],
  autoplay: true,
  autoplayDelay: 5000,
  pauseOnHover: true,
  loop: true,
  maxWidth: undefined,
});

const containerPadding = 0;
const containerWidth = ref(0);
const viewportWidth = ref(0);
const itemWidth = computed(() => containerWidth.value - containerPadding * 2);
const trackItemOffset = computed(() => itemWidth.value + GAP);

const carouselItems = computed(() => (props.loop ? [...props.items, ...(props.items[0] ? [props.items[0]] : [])] : props.items));
const currentIndex = ref<number>(0);
const motionX = useMotionValue(0);
const isAutoplaying = ref<boolean>(false);

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
let autoplayTimer: number | null = null;

const dragConstraints = computed(() => {
  return props.loop
    ? {}
    : {
      left: -trackItemOffset.value * (carouselItems.value.length - 1),
      right: 0
    };
});

const setCurrentIndex = (index: number) => {
  currentIndex.value = index;
  stopAutoplay();
};

const handleAnimationComplete = () => {
  if (props.loop && currentIndex.value === carouselItems.value.length - 1) {
    motionX.set(0);
    currentIndex.value = 0;
  }
};

interface DragInfo {
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
}

const handleDragEnd = (event: Event, info: DragInfo) => {
  const offset = info.offset.x;
  const velocity = info.velocity.x;

  if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
    if (props.loop && currentIndex.value === props.items.length - 1) {
      currentIndex.value = currentIndex.value + 1;
    } else {
      currentIndex.value = Math.min(currentIndex.value + 1, carouselItems.value.length - 1);
    }
  } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
    if (props.loop && currentIndex.value === 0) {
      currentIndex.value = props.items.length - 1;
    } else {
      currentIndex.value = Math.max(currentIndex.value - 1, 0);
    }
  }
  stopAutoplay();
};

const startAutoplay = () => {
  if (props.autoplay) {
    isAutoplaying.value = true;
    autoplayTimer = window.setInterval(() => {
      currentIndex.value = (() => {
        const prev = currentIndex.value;
        if (prev === carouselItems.value.length - 1) {
          return props.loop ? 0 : prev;
        }
        return prev + 1;
      })();
    }, props.autoplayDelay);
  }
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    isAutoplaying.value = false;
  }
};

const restartAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

const handleMouseEnter = () => {
  if (props.pauseOnHover) {
    stopAutoplay();
  }
};

watch(
  [
    () => props.autoplay,
    () => props.autoplayDelay,
    () => props.loop,
    () => props.items.length,
    () => carouselItems.value.length,
    () => props.pauseOnHover
  ],
  () => {
    restartAutoplay();
  }
);

const updateContainerWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.clientWidth;
    viewportWidth.value = document.documentElement.clientWidth;
  }
};

// Hide items until container width is calculated
const isInitialized = computed(() => containerWidth.value > 0);

onMounted(() => {
  updateContainerWidth();
  window.addEventListener('resize', updateContainerWidth);
  startAutoplay();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth);
  stopAutoplay();
});

const sliderEvents = computed(() => {
  return props.pauseOnHover ? {
    mouseenter: handleMouseEnter,
  } : {};
});
</script>

<style scoped>
.carousel {
  mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
}

@screen md {
  .carousel {
    mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%);
  }
}
</style>