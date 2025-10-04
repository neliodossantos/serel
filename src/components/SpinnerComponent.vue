<script setup lang="ts"></script>
<template>
  <div class="border-4 border-gray-300 border-dashed rounded-full animate-spin"></div>
</template>
<style>
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 1s forwards;
}
</style>