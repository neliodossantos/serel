<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { ToastPosition } from '@/composables/useToast';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: ToastPosition;
}

const props = withDefaults(defineProps<ToastProps>(), {
  type: 'info',
  duration: 3000,
  position: 'top-right'
});

const emit = defineEmits(['close']);
const isVisible = ref(false);
let timeout: number;

const bgColors = {
  success: 'bg-[#003F72]',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500'
};

const icons = {
  success: 'bx bxs-check-circle',
  error: 'bx bxs-x-circle',
  info: 'bx bxs-info-circle',
  warning: 'bx bxs-info-circle'
};

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4',
  'bottom-center': 'bottom-4'
};

const slideDirections = {
  'top-right': 'translate-x-full',
  'top-left': '-translate-x-full',
  'bottom-right': 'translate-x-full',
  'bottom-left': '-translate-x-full',
  'top-center': '-translate-y-full',
  'bottom-center': 'translate-y-full'
};

onMounted(() => {
  isVisible.value = true;
  timeout = setTimeout(() => {
    close();
  }, props.duration);
});

onBeforeUnmount(() => {
  clearTimeout(timeout);
});

const close = () => {
  isVisible.value = false;
  setTimeout(() => {
    emit('close');
  }, 300);
};
</script>

<template>
  <div
      class="flex items-center p-5 rounded-md shadow-lg transform transition-all duration-300"
      :class="[
      bgColors[type],
      positionClasses[position],
      isVisible ? 'translate-x-0 translate-y-0 opacity-100' : `${slideDirections[position]} opacity-0`
    ]"
  >
    <div class="flex-shrink-0 w-6 h-6 flex items-center justify-center text-white mr-2">
      <i :class="icons[type]" class="text-2xl"></i>
    </div>
    <div class="flex-grow text-white">{{ message }}</div>
    <button
        @click="close"
        class="ml-4 text-white hover:text-gray-200 focus:outline-none"
    >
      ✕
    </button>
  </div>
</template>