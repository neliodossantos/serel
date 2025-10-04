<script setup lang="ts">

const props = defineProps({
  value: {
    type: String,
    default : 'dados'
  },
})
</script>
<template>
  <div class="text-center">
    <!-- <div class="flex flex-col items-center animate-fade-in">
      <div class="">
        <img src="@/assets/img/sad-circle-svgrepo-com.svg" alt="No data" class="mx-auto w-24 h-24">
        <p class="mt-4 text-lg font-semibold text-gray-500 animate-fade-in-delay">Sem {{value}} disponíveis!</p>
      </div>
    </div> -->
    <div class="text-center flex flex-col items-center py-12">
        <i
            class="bx bx-search-alt-2 text-6xl text-gray-300 mb-4"
        ></i>
        <h3 class="text-2xl font-bold text-gray-600 mb-2">
            Nenhum resultado encontrado
        </h3>
        <p class="text-gray-500 max-w-lg mb-6">
          Verifique sua conexão ou use termos diferentes ou mais específicos.
        </p>
    </div>
  </div>
</template>

<style scoped>
</style>
