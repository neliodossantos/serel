<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import type { ToastPosition } from '@/composables/useToast';
import { computed } from 'vue';

const { toasts, close } = useToast();

const groupedToasts = computed(() => {
  const groups = {} as Record<ToastPosition, typeof toasts.value>;

  for (const toast of toasts.value) {
    const position = toast.position || 'top-right';
    if (!groups[position]) {
      groups[position] = [];
    }
    groups[position].push(toast);
  }

  return groups;
});
</script>

<template>
  <template v-for="(group, position) in groupedToasts" :key="position">
    <div class="min-w-full sm:min-w-[300px] fixed z-50 space-y-4" :class="{
      'top-0 right-0 p-4': position === 'top-right',
      'top-0 left-0 p-4': position === 'top-left',
      'bottom-0 right-0 p-4': position === 'bottom-right',
      'bottom-0 left-0 p-4': position === 'bottom-left',
      'top-0 left-1/2 -translate-x-1/2 p-4': position === 'top-center',
      'bottom-0 left-1/2 -translate-x-1/2 p-4': position === 'bottom-center'
    }">
      <component v-for="toast in group" :key="toast.id" :is="toast.component" v-bind="toast" @close="close(toast.id)"/>
    </div>
  </template>
</template>