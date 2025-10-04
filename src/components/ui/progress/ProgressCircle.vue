<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
    required: false
  }
});
const progressClass = computed(() => {
    if (props.progress >= 0 && props.progress <= 24) return 'stroke-[#E53935]'
    if (props.progress >= 25 && props.progress <= 49) return 'stroke-[#FB8C00]'
    if (props.progress >= 50 && props.progress <= 74) return 'stroke-[#FDD835]'
    if (props.progress >= 75 && props.progress <= 100) return 'stroke-[#00B887]'
    return ''
})

</script>
<template>
  <div class="flex flex-col items-center justify-center">
    <div class="relative">
      <svg class="w-[90px] h-[90px] -rotate-90">
        <!-- Fundo do Círculo -->
        <circle cx="50%" cy="50%" r="40%" class="stroke-gray-200 fill-none" stroke-width="15"/>
        <!-- Progresso do Círculo -->
        <circle v-if="progress > 0"
            cx="50%" cy="50%"
            r="40%" class="fill-none" stroke-width="15" :class="progressClass"
            stroke-dasharray="220.2" :stroke-dashoffset="220.2 - (220.2 * progress) / 100"
            stroke-linecap="round" style="transition: stroke-dashoffset 0.3s ease"
        />
      </svg>
      <!-- Texto da Porcentagem -->
      <div class="absolute inset-0 flex items-center justify-center text-lg font-bold dark:text-white">
        {{ progress }}%
      </div>
    </div>
  </div>
</template>
<style scoped>

</style>
