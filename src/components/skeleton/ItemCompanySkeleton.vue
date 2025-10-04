<script setup lang="ts">

</script>

<template>
  <div class="w-full">
    <div class="flex md:flex-col md:gap-0 gap-5">
      <div class="w-32 h-32 mb-4 bg-gray-200 rounded"></div>
      <div class="flex flex-col justify-between">
        <div class="w-32 h-4 bg-gray-200 rounded"></div>
        <div class="w-32 mt-2 h-4 bg-gray-200 rounded"></div>
        <div class="w-4 h-4"></div>
        <div class="flex w-full gap-1 items-center">
          <div class="flex gap-1">
            <div class="bg-gray-200 rounded w-4 h-4 3xl:w-5 3xl:h-5" v-for="i in 5"></div>
          </div>
        </div>
        <div class="bg-gray-200 w-32 h-4 mt-1 rounded"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>