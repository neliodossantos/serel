<script setup lang="ts">
import { ref, computed } from 'vue'
// Props com o array de itens
const props = withDefaults(defineProps<{
  items: any[] // Tipo genérico para máxima flexibilidade
}>(), {
  items: () => []
})
// Número de itens
const itemsCount = computed(() => props.items.length)
// Estado do índice atual
const currentIndex = ref(0)
// Função para próximo slide
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % itemsCount.value
}
// Função para slide anterior
const prevSlide = () => {
  currentIndex.value =
      (currentIndex.value - 1 + itemsCount.value) % itemsCount.value
}
// Função para ir para um slide específico
const goToSlide = (index: number) => {
  currentIndex.value = index
}
</script>
<template>
  <div class="relative w-full max-w-4xl mx-auto">
    <!-- Carousel Container -->
    <div class="overflow-hidden relative">
      <!-- Slides Container -->
      <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <div v-for="(_, index) in itemsCount" :key="index" class="flex-shrink-0 w-full">
          <slot :name="`slide-${index}`" :item="items[index]">
            Slide {{ index + 1 }} (Conteúdo padrão)
          </slot>
        </div>
      </div>
    </div>
    <!-- Navigation Buttons -->
    <div class="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between gap-1 px-1">
      <button @click="prevSlide" class="bg-[#003F72] text-white w-7 h-7 text-sm rounded-full shadow hover:bg-blue-500 transition">
        <i class='bx bx-left-arrow-alt'></i>
      </button>
      <button @click="nextSlide" class="bg-[#003F72] w-7 h-7 text-sm text-white rounded-full shadow hover:bg-blue-500 transition">
        <i class='bx bx-right-arrow-alt'></i>
      </button>
    </div>
    <div class="flex justify-center mt-4 space-x-2">
      <button v-for="(_, index) in itemsCount" :key="index"
          @click="goToSlide(index)" class="w-3 h-3 rounded-full" :class="[currentIndex === index ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400']"></button>
    </div>
  </div>
</template>