<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import {onMounted, reactive, ref} from "vue";
import CreateCompanyFormComponent from "@/components/companies/CreateCompanyFormComponent.vue";
const isLoading = ref(false);
const successRequest = ref(false);

function toggleSuccessRequest(value : boolean){
  successRequest.value = value;
}


</script>
<template>
  <div v-if="!successRequest" class="w-full h-screen flex items-center justify-center">
    <div class="p-5 md:p-0 md:max-w-2xl flex flex-col gap-5">
      <h2 class="text-3xl md:text-4xl font-bold">
        <i class="bx bxs-check-circle text-[#003F72] animate-bounce text-5xl"></i>
        Empresa foi adicionada com sucesso!
      </h2>
      <p class="text-xl md:text-2xl">A empresa adicionada será analisada pela nossa equipe. Assim que for aprovada, receberá um email e  ela ficará visível para os outros usuários. 😊</p>
      <div>
        <a href="/public" class="flex items-center gap-2 justify-center w-64 hover:bg-[#003F72] hover:text-white border-2 border-[#003F72] p-2 rounded-md text-md md:text-xl">
          <i class='bx bx-left-arrow-alt text-xl'></i>
          Ir para pagina Inicial </a>
      </div>
    </div>
  </div>
  <div v-else class="">
    <PreloaderComponent v-if="isLoading"></PreloaderComponent>
    <MainLayout v-else>
      <div class="w-full bg-[#F8FAFB] min-h-[210px] mb-24 flex justify-center border-b border-[#D4D2D0] px-[12%]"></div>
      <div class="w-full mb-24 px-[12%]">
        <div class="mx-auto relative max-w-[400px] sm:max-w-[600px] md:max-w-[900px]">
          <a class="left-30 max-w-[150px] h-[150px] block -top-[11rem] md:-top-44 absolute cursor-pointer" href="/public">
            <img class="max-w-[150px] max-h-40 object-cover rounded block" src="../../assets/img/logo_alternativo_serel.png" alt="Logo da empresa Serel">
          </a>
          <CreateCompanyFormComponent @toggleSuccessRequest="toggleSuccessRequest"></CreateCompanyFormComponent>
        </div>
      </div>
    </MainLayout>
  </div>
</template>
<style scoped>
</style>