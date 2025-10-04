<script setup lang="ts">
import router from "@/router";
const backToPage = () => {
  router.back();
}
</script>
<template>
  <div class="w-full h-screen flex items-center justify-center px-10 py-10">
    <div class="flex md:flex-row flex-col-reverse items-center md:gap-10">
      <div class="md:w-[800px]">
        <a href="/">
          <img class="max-w-44 mb-5" src="@/assets/img/logo.png" alt="">
        </a>
        <div class="flex flex-col justify-center max-w-[380px]">
          <h2 class="font-bold text-2xl">Falta alguma coisa.</h2>
          <p class="mt-2">Desculpe, não conseguimos encontrar essa página. Você encontrará muito para explorar clique em voltar.</p>
          <button @click="backToPage" class="mt-5 bg-[#003F72] py-2 md:px-12 max-w-[375px] flex justify-center items-center gap-2 rounded text-white">
            <i class='bx bx-arrow-back'></i>
            Voltar à  página anterior
          </button>
        </div>
      </div>
      <img class="max-w-[400px]" src="@/assets/img/404%20error%20with%20portals-rafiki.svg" alt="">
    </div>
  </div>
</template>
<style scoped>
</style>