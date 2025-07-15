<template>
  <div ref="containerRef" :class="[
    'relative overflow-hidden p-4',
    'rounded-[24px] border border-[#333]'
  ]" :style="{
    width: `${baseWidth}px`,
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
        'relative shrink-0 flex flex-col overflow-hidden cursor-grab active:cursor-grabbing',
        'items-start justify-between bg-gray-100 border border-[#333] rounded-[12px]'
      ]" :style="{
        width: itemWidth + 'px',
        height: '100%',
        rotateY: getRotateY(index),
      }" :transition="effectiveTransition">
        <div class="p-5 text-gray-900">
          <div class="mb-1 font-black text-lg">{{ item.title }}</div>
          <p class="text-sm">{{ item.description }}</p>
          <div class="my-4" v-if="item.icons">
            <span class="flex gap-2 items-center">
              <i v-for="icon in Array.isArray(item.icons) ? item.icons : [item.icons]" :key="icon" :class="icon"
                class="text-white text-xl"></i>
            </span>
          </div>
        </div>
      </Motion>
    </Motion>

    <div :class="['flex w-full justify-center', 'absolute z-20 bottom-12 left-1/2 -translate-x-1/2']">
      <div class="mt-4 flex w-[150px] justify-between px-8">
        <Motion v-for="(_, index) in items" :key="index" tag="div" :class="[
          'h-2 w-2 rounded-full cursor-pointer transition-colors duration-150',
          currentIndex % items.length === index
            ? 'bg-gray-600'
            : 'bg-gray-100'
        ]" :animate="{
          scale: currentIndex % items.length === index ? 1.2 : 1
        }" @click="() => setCurrentIndex(index)" :transition="{ duration: 0.15 }" />
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
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
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
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

const props = withDefaults(defineProps<CarouselProps>(), {
  items: () => [],
  autoplay: true,
  autoplayDelay: 5000,
  pauseOnHover: false,
  loop: true,
  baseWidth: 400,
});

const containerPadding = 16;
const itemWidth = computed(() => props.baseWidth - containerPadding * 2);
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
    stopAutoplay();
    startAutoplay();
  }
);

onMounted(() => {
  if (props.pauseOnHover && containerRef.value) {
    containerRef.value.addEventListener('mouseenter', handleMouseEnter);
    containerRef.value.addEventListener('mouseleave', handleMouseLeave);
  }
  startAutoplay();
});

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('mouseenter', handleMouseEnter);
    containerRef.value.removeEventListener('mouseleave', handleMouseLeave);
  }
  stopAutoplay();
});
</script>
