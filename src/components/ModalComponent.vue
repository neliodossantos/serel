<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";

interface Props {
  isOpen: boolean;
  title?: string;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  title: '',
  maxWidth: 'md',
  showCloseButton: true
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};

const maxWidthClass = computed(() => {
  return {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    'full': 'max-w-full'
  }[props.maxWidth] || 'max-w-md';
});
</script>
<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto p-4">
      <div class="fixed inset-0 transition-opacity" @click="closeModal"></div>

      <Transition name="modal-content">
        <div :class="['relative bg-white rounded-lg shadow-xl mx-auto', maxWidthClass]" @click.stop>
          <!-- Cabeçalho com título opcional -->
          <div v-if="title || showCloseButton" class="flex items-center justify-between p-4 border-b">
            <h3 v-if="title" class="text-lg font-medium text-gray-900">{{ title }}</h3>
            <div v-else class="flex-grow"></div>

            <button v-if="showCloseButton" @click="closeModal" class="text-gray-500 hover:text-gray-700 focus:outline-none">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Conteúdo do modal -->
          <div class="overflow-y-auto">
            <slot></slot>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
<style scoped>
/* Animação para o fundo do modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animação para o conteúdo do modal */
.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}
.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
