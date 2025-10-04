<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
const redirectToPage = ref<string>(localStorage.getItem('redirect') || '/');
</script>
<template>
  <div class="w-full h-screen flex items-center justify-center px-10 py-10">
    <div class="flex md:flex-row flex-col-reverse items-center md:gap-10">
      <div class="md:w-[800px]">
        <a href="/">
          <img class="max-w-44 mb-5" src="@/assets/img/logo.png" alt="">
        </a>
        <div class="flex flex-col justify-center max-w-[380px]">
          <h2 class="font-bold text-2xl">Token Expirou!</h2>
          <p class="mt-2">Desculpe, seu token de autenticação expirou. Por questões de segurança, é necessário fazer login novamente para continuar a explorar o sistema.</p>
          <a :href="'/login?redirect=' + redirectToPage" class="mt-5 bg-[#003F72] py-2 md:px-12 max-w-[375px] flex justify-center items-center gap-2 rounded text-white">
            Log in
          </a>
        </div>
      </div>
      <img class="max-w-[400px]" src="@/assets/img/403%20Error%20Forbidden-rafiki.svg" alt="">
    </div>
  </div>
</template>
<style scoped>
</style>