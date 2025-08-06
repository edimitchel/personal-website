<template>

  <div ref="containerRef" class="h-[230px]">
    <div class="absolute overflow-hidden inset-x-0 py-4 mb-4 w-full" :style="{
      maxWidth: maxWidth ? `${maxWidth}px` : '100%'
    }">
      <div class="relative w-full min-h-[170px]">
        <div v-if="!isInitialized" class="absolute inset-0 flex items-center justify-center text-center">
          <div class="text-primary-600 animate-pulse">{{ $t('carousel.loading') }}...</div>
        </div>
        <Motion v-if="isInitialized" tag="div" class="flex" drag="x" :dragConstraints="dragConstraints" :style="{
          gap: `${GAP}px`,
          x: motionX,
        }" @dragEnd="handleDragEnd" :animate="{ x: -(currentIndex * trackItemOffset) }"
          :transition="effectiveTransition" @animationComplete="handleAnimationComplete">
          <Motion v-for="(item, index) in carouselItems" :key="index" tag="div" :class="[
            'relative shrink-0 flex flex-col cursor-grab active:cursor-grabbing min-h-[150px]',
            'items-start justify-between bg-foreground shadow-sm shadow-primary/40 rounded-lg p-2',
            'transition-opacity duration-500'
          ]" :style="{
            width: itemWidth > 0 ? `${itemWidth}px` : '100%',
            height: '100%',
            opacity: getItemOpacity(index),
          }" :transition="effectiveTransition">
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
import { Motion, useMotionValue, useTransform } from 'motion-v';

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
const itemWidth = computed(() => containerWidth.value - containerPadding * 2);
const trackItemOffset = computed(() => itemWidth.value + GAP);

const carouselItems = computed(() => (props.loop ? [...props.items, ...(props.items[0] ? [props.items[0]] : [])] : props.items));
const currentIndex = ref<number>(0);
const motionX = useMotionValue(0);
const isHovered = ref<boolean>(false);
const isResetting = ref<boolean>(false);

const containerRef = ref<HTMLDivElement>();
let autoplayTimer: number | null = null;

const dragConstraints = computed(() => {
  return props.loop
    ? {}
    : {
      left: -trackItemOffset.value * (carouselItems.value.length - 1),
      right: 0
    };
});

const effectiveTransition = computed(() => (isResetting.value ? { duration: 0 } : SPRING_OPTIONS));

const getItemOpacity = (index: number) => {
  if (containerWidth.value === 0) return 0;

  // Calculate visual distance based on position in 3D space
  const visualDistance = Math.abs(index - currentIndex.value);

  // Make opacity more pronounced - current item fully visible, others fade
  if (visualDistance === 0) return 1;
  if (visualDistance === 1) return 0.7;
  if (visualDistance === 2) return 0.4;
  return 0.2;
};

const setCurrentIndex = (index: number) => {
  currentIndex.value = index;
  stopAutoplay();
};

const handleAnimationComplete = () => {
  if (props.loop && currentIndex.value === carouselItems.value.length - 1) {
    isResetting.value = true;
    motionX.set(0);
    currentIndex.value = 0;
    setTimeout(() => {
      isResetting.value = false;
    }, 50);
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
  if (props.autoplay && (!props.pauseOnHover || !isHovered.value)) {
    autoplayTimer = window.setInterval(() => {
      currentIndex.value = (() => {
        const prev = currentIndex.value;
        if (prev === props.items.length - 1 && props.loop) {
          return prev + 1;
        }
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
  }
};

const restartAutoplay = () => {
  stopAutoplay();
  startAutoplay();
};

const handleMouseEnter = () => {
  isHovered.value = true;
  if (props.pauseOnHover) {
    stopAutoplay();
  }
};

const handleMouseLeave = () => {
  isHovered.value = false;
  if (props.pauseOnHover) {
    startAutoplay();
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
  }
};

// Hide items until container width is calculated
const isInitialized = computed(() => containerWidth.value > 0);

onMounted(() => {
  if (containerRef.value) {
    if (props.pauseOnHover) {
      containerRef.value.addEventListener('mouseenter', handleMouseEnter);
      containerRef.value.addEventListener('mouseleave', handleMouseLeave);
    }
    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
  }
  startAutoplay();
});

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('mouseenter', handleMouseEnter);
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave);
  }
  window.removeEventListener('resize', updateContainerWidth);
  stopAutoplay();
});
</script>

<style scoped>
.relative {
  position: relative;
}
</style>