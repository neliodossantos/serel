<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import {onMounted , ref } from "vue";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import FormAddCompanyComponent from "@/components/companies/FormAddCompanyComponent.vue";

const successRequest = ref(false);
const isLoading = ref(true);


function toggleSuccessRequest(value : boolean){
  successRequest.value = value
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  },1000);
}
onMounted( ()=>{
  setTimeout(()=>{
    isLoading.value = false;
  },1000);
});
</script>

<template>
  <div v-if="successRequest" class="">
    <PreloaderComponent v-if="isLoading"></PreloaderComponent>
    <div v-else class="w-full h-screen flex items-center justify-center">
      <div class="p-5 md:p-0 max-w-2xl flex flex-col gap-5">
          <i class="block mx-auto bx bxs-check-circle text-[#003F72] animate-bounce text-7xl"></i>
          <h2 class="text-center text-3xl md:text-4xl md:max-w-2xl font-bold">
            Solicitação para adicionar empresa foi recebida com sucesso! 🎉 
          </h2>
          <div class="bg-gray-100 p-4 rounded-lg text-left">
              <div class="flex flex-col items-start">
                  <div class="flex items-center justify-center mb-2 gap-2">
                    <i class="bx bx-info-circle text-[#003F72] text-xl "></i>
                    <h4 class="text-lg sm:text-xl font-semibold text-[#003F72]">Próximos passos:</h4>
                  </div>
                  <div>
                      <ul class="text-blue-700 space-y-1 text-sm">
                          <li class="flex items-center gap-2 text-[#003F72]">
                              <i class="bx bx-check text-xs"></i>
                              Nossa equipe analisará as informações fornecidas
                          </li>
                          <li class="flex items-center gap-2 text-[#003F72]">
                              <i class="bx bx-check text-xs"></i>
                              Verificaremos a autenticidade dos dados
                          </li>
                          <li class="flex items-center gap-2 text-[#003F72]">
                              <i class="bx bx-check text-xs"></i>
                              Você receberá um email com a decisão em até 3 dias úteis
                          </li>
                      </ul>
                  </div>
              </div>
          </div>            
          <p class="text-gray-500 text-center text-base">
              Após a aprovação, a empresa ficará disponível para avaliar.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/"
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003F72] text-white rounded-lg hover:bg-[#002a4d] transition-all transform hover:scale-105">
                  <i class='bx bx-home'></i>
                  Página Inicial
              </a>
              <a href="/filter?q="
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#003F72] text-[#003F72] rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105">
                  <i class='bx bx-search'></i>
                  Explorar Empresas
              </a>
          </div>
        </div>
    </div>
  </div>
  <div v-else>
    <PreloaderComponent v-if="isLoading"></PreloaderComponent>
    <MainLayout v-else>
      <div class="w-full bg-[#F8FAFB] min-h-[210px] mb-24 flex justify-center border-b border-[#D4D2D0] px-[12%]"></div>
      <div class=" w-full mb-24 px-[12%]">
        <div class="mx-auto relative max-w-[400px] sm:max-w-[600px] md:max-w-[900px]">
          <a class="left-30 max-w-[150px] h-[150px] block -top-[11rem] md:-top-44 absolute cursor-pointer" href="/">
            <img class="max-w-[150px] max-h-40 object-cover rounded block" src="@/assets/img/logo_alternativo_serel.png" alt="Logo da empresa Serel">
          </a>
          <FormAddCompanyComponent @toggleSuccessRequest="toggleSuccessRequest"></FormAddCompanyComponent>
        </div>
      </div>
    </MainLayout>
  </div>
</template>
<style scoped>
</style>