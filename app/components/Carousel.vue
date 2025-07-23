<template>
  <div ref="containerRef" class="relative overflow-hidden p-4 mb-4 w-full" :style="{
    maxWidth: maxWidth ? `${maxWidth}px` : '100%'
  }">
    <Motion tag="div" class="flex" drag="x" :dragConstraints="dragConstraints" :style="{
      width: itemWidth + 'px',
      gap: `${GAP}px`,
      perspective: 1000,
      perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
      x: motionX
    }" @dragEnd="handleDragEnd" :animate="{ x: -(currentIndex * trackItemOffset) }" :transition="effectiveTransition"
      @animationComplete="handleAnimationComplete">
      <Motion v-for="(item, index) in carouselItems" :key="index" tag="div" :class="[
        'relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing min-h-[150px]',
        'items-start justify-between bg-forground shadow-sm rounded-lg p-2'
      ]" :style="{
        width: itemWidth + 'px',
        height: '100%',
        rotateY: getRotateY(index),
      }" :transition="effectiveTransition">
        <div v-if="!$slots.default" class="p-1 text-primary-900">
          <div class="mb-1 font-black text-lg">{{ item.title }}</div>
          <p class="text-sm">{{ item.description }}</p>
          <div class="my-4" v-if="item.icons">
            <span class="flex gap-2 items-center">
              <i v-for="icon in Array.isArray(item.icons) ? item.icons : [item.icons]" :key="icon" :class="icon"
                class="text-forground text-xl"></i>
            </span>
          </div>
        </div>
        <slot v-else :item="item" />
      </Motion>
    </Motion>

    <div class="flex w-full justify-center pt-4 gap-2">
        <Motion v-for="(_, index) in items" :key="index" tag="div" :class="[
          'h-3 w-3 rounded-full transition-colors duration-150 border border-primary-600 cursor-pointer',
          currentIndex % items.length === index
            ? 'bg-primary-600'
            : 'bg-primary-100'
        ]" :animate="{
      scale: currentIndex % items.length === index ? 1.2 : 1
    }" @click="() => setCurrentIndex(index)" :transition="{ duration: 0.15 }" />
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

const containerPadding = 16;
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

const maxItems = Math.max(props.items.length + 1, 10);
const rotateYTransforms = Array.from({ length: maxItems }, (_, index) => {
  const range = computed(() => [
    -(index + 1) * trackItemOffset.value,
    -index * trackItemOffset.value,
    -(index - 1) * trackItemOffset.value
  ]);
  const outputRange = [90, 0, -90];
  return useTransform(motionX, range, outputRange, { clamp: false });
});

const getRotateY = (index: number) => {
  return rotateYTransforms[index] || rotateYTransforms[0];
};

const setCurrentIndex = (index: number) => {
  currentIndex.value = index;
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
  restartAutoplay();
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
    isHovered,
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
