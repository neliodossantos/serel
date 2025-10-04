<script setup lang="ts">
import router from "@/router";

const backToPage = () => {
  router.back();
}

</script>
<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div class="flex md:flex-row flex-col-reverse items-center md:gap-10">
      <div class="md:w-[800px]">
        <a href="/">
          <img class="max-w-44 mb-5" src="@/assets/img/logo.png" alt="">
        </a>
        <div class="flex flex-col justify-center max-w-[380px]">
          <h2 class="font-bold text-2xl">Não tens permissão!</h2>
          <p class="mt-2">Desculpe, não tens permissão para acessar a página. Você encontrará muito para explorar clique em voltar.</p>
          <a href="/" class="mt-5 bg-[#003F72] py-2 md:px-12 max-w-[375px] flex justify-center items-center gap-2 rounded text-white">
            <i class='bx bx-arrow-back'></i>
            Voltar para Pagina Inicial
          </a>
        </div>
      </div>
      <img class="max-w-[400px]" src="@/assets/img/403%20Error%20Forbidden-rafiki.svg" alt="">
    </div>
  </div>
</template>
<style scoped>
</style>