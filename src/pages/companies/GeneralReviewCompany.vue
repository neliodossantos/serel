<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import {onMounted, ref} from "vue";
import FormGeneralSalaryCompanyComponent from "@/components/companies/general/FormGeneralSalaryCompanyComponent.vue";
import FormGeneralReviewCompanyComponent from "@/components/companies/general/FormGeneralReviewCompanyComponent.vue";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import {useUserStore} from "@/stores/users";
import router from "@/router";
import ModalComponent from "@/components/ModalComponent.vue";

const showWarningReview = ref(false);
const successRequest = ref(false);
const isLoading = ref(true);
const selectedType = ref('Salary');

function selectType(value: string){
  selectedType.value = value;
}
onMounted( ()=>{
  setTimeout(()=>{
    isLoading.value = false;
    showWarningReview.value = true;
  },1000);

  setTimeout(() => {
    showWarningReview.value = false;
  },30000);
});

function toggleSuccessRequest(value : boolean){
  successRequest.value = value
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  },1000);
}
</script>
<template>
  <div v-if="successRequest" class="">
    <PreloaderComponent v-if="isLoading"></PreloaderComponent>
    <div v-else class="w-full h-screen flex items-center justify-center">
      <div class="p-5 md:p-0 max-w-2xl flex flex-col gap-5">
          <i class="block mx-auto bx bxs-check-circle text-[#003F72] animate-bounce text-7xl"></i>
          <h2 class="text-center text-3xl md:text-4xl md:max-w-2xl font-bold text-white">
            Avaliação foi enviada com sucesso! 🎉 
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
                              Você receberá um email com a decisão em até 3 dias úteis
                          </li>
                      </ul>
                  </div>
              </div>
          </div>            
          <p class="text-gray-500 dark:text-gray-300 text-center text-base">
              Será analisada pela nossa equipe, avaliação ficará visível para os outros usuários. 😊
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/"
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#003F72] text-white rounded-lg hover:bg-[#002a4d] transition-all transform hover:scale-105">
                  <i class='bx bx-home'></i>
                  Página Inicial
              </a>
              <a href="/filter?q="
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#003F72] text-[#003F72] dark:text-white dark:border-white dark:border hover:dark:bg-[#003F72] hover:dark:border-none rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105">
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
      <ModalComponent 
        :isOpen="showWarningReview" 
        @close="showWarningReview = false"
        title="Diretrizes para avaliação"
        maxWidth="xl"
      >
        <div class="p-6">
          <div class="flex items-start mb-4">
            <div class="flex justify-center items-center bg-blue-50 p-3 w-12 h-12 rounded-full mr-4">
              <i class='bx bxs-info-circle text-3xl text-[#003F72]'></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Lembre-se dessas diretrizes importantes:</h3>
              <p class="text-gray-600 mt-1">Sua avaliação ajuda outros profissionais a tomarem decisões importantes</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4 mb-4">
            <ul class="space-y-3">
              <li class="flex items-start">
                <i class='bx bx-check-circle text-xl text-green-600 mr-2 mt-0.5'></i>
                <span>Evite linguagem agressiva ou discriminatória</span>
              </li>
              <li class="flex items-start">
                <i class='bx bx-check-circle text-xl text-green-600 mr-2 mt-0.5'></i>
                <span>Não utilize palavrões ou conteúdo inapropriado</span>
              </li>
              <li class="flex items-start">
                <i class='bx bx-check-circle text-xl text-green-600 mr-2 mt-0.5'></i>
                <span>Todas as avaliações passam por moderação para garantir a qualidade</span>
              </li>
              <li class="flex items-start">
                <i class='bx bx-lock text-xl text-[#003F72] mr-2 mt-0.5'></i>
                <span>Sua avaliação será publicada de forma <strong>anônima</strong>, garantindo sua privacidade</span>
              </li>
            </ul>
          </div>

          <div class="flex justify-end">
            <button 
              @click="showWarningReview = false" 
              class="bg-[#003F72] hover:bg-[#002a4d] text-white font-medium px-5 py-3 rounded-lg transition-colors"
            >
              Entendi, continuar
            </button>
          </div>
        </div>
      </ModalComponent>
      <div class="w-full bg-[#F8FAFB] dark:bg-[#000e1c] md:h-[500px] sm:py-10 mb-24 flex justify-center border-b border-[#D4D2D0] px-[12%]">
        <div class="w-full flex pt-12 md:pt-0 md:pb-0 pb-12 md:gap-[64px] flex-wrap items-center justify-between">
          <div class="w-full px-[12%]">
            <div class="flex items-center gap-[64px] justify-between">
              <div class="flex-1 text-center pb-8">
                <button class="text-xs md:text-base dark:text-white border p-2 mb-3 rounded-lg shadow-sm flex items-center justify-center mx-auto gap-2">
                  <i class='bx bx-star text-lg sm:text-xl 2xl:text-2xl text-[#003F72] dark:text-white' ></i>
                  Avaliações reais de funcionários</button>
                <h1 class="hidden sm:block text-3xl mb-2.5 font-bold sm:text-4xl 2xl:text-5xl max-w-xl mx-auto text-[#2D2D2D] dark:text-white">Avalie Empresas Compartilhe Críticas, Salários e Experiências!</h1>
                <h1 class="block sm:hidden text-3xl mb-2.5 font-bold sm:text-4xl 2xl:text-5xl w-full text-[#2D2D2D] dark:text-white">Avalie Empresas Compartilhe Críticas, Salários</h1>
                <p class="hidden md:block text-xl md:text-2xl max-w-[800px] mx-auto dark:text-gray-300">Compartilhe suas experiências profissionais, avalie empresas, revele salários e ajude a construir um mercado de trabalho mais transparente!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full mb-24 px-[12%] h-full">
        <div class="mx-auto relative max-w-[400px] bg-gray-500 h-auto sm:max-w-[600px] md:max-w-[900px]">
          <div class="left-30 w-full h-auto rounded -top-40 absolute cursor-pointer">
            <div class="p-5 rounded-lg bg-white shadow">
              <div class="w-full">
                <h1 class="text-xl md:text-2xl font-bold mb-2">Desejas avaliar?</h1>
                <div class="hidden sm:flex justify-between w-full">
                  <button class="border border-[#D4D2D0] p-3 w-full font-bold rounded-l-lg flex flex-1 items-center justify-center gap-2 md:gap-3" @click="selectType('Salary')"
                          :class=" selectedType === 'Salary' ? 'bg-[#003F72] text-white' : 'bg-white text-[#003F72]'">
                    <svg
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16 12c2.76 0 5-2.24 5-5s-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5m5.45 5.6c-.39-.4-.88-.6-1.45-.6h-7l-2.08-.73l.33-.94L13 16h2.8c.35 0 .63-.14.86-.37s.34-.51.34-.82c0-.54-.26-.91-.78-1.12L8.95 11H7v9l7 2l8.03-3c.01-.53-.19-1-.58-1.4M5 11H.984v11H5z"/>
                    </svg>
                    Salário
                  </button>
                  <button class="border border-[#D4D2D0] p-3 w-full font-bold  rounded-r-lg flex flex-1 items-center justify-center gap-2 md:gap-3" @click="selectType('Review')"
                          :class=" selectedType === 'Review' ? 'bg-[#003F72] text-white' : 'bg-white text-[#003F72]'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"/></svg>
                    Experiencia</button>
                </div>
                <div class="flex sm:hidden flex-col gap-2 w-full">
                  <button class="border border-[#D4D2D0] p-3 w-full font-bold rounded-lg flex flex-1 items-center justify-center gap-2 md:gap-3" @click="selectType('Salary')"
                          :class=" selectedType === 'Salary' ? 'bg-[#003F72] text-white' : 'bg-white text-[#003F72]'">
                    <svg
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M16 12c2.76 0 5-2.24 5-5s-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5m5.45 5.6c-.39-.4-.88-.6-1.45-.6h-7l-2.08-.73l.33-.94L13 16h2.8c.35 0 .63-.14.86-.37s.34-.51.34-.82c0-.54-.26-.91-.78-1.12L8.95 11H7v9l7 2l8.03-3c.01-.53-.19-1-.58-1.4M5 11H.984v11H5z"/>
                    </svg>
                    Salário
                  </button>
                  <button class="border border-[#D4D2D0] p-3 w-full font-bold  rounded-lg flex flex-1 items-center justify-center gap-2 md:gap-3" @click="selectType('Review')"
                          :class=" selectedType === 'Review' ? 'bg-[#003F72] text-white' : 'bg-white text-[#003F72]'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"/></svg>
                    Experiencia</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mx-auto relative max-w-[400px] sm:max-w-[600px] md:max-w-[900px]">
          <FormGeneralSalaryCompanyComponent @toggleSuccessRequest="toggleSuccessRequest" v-if="selectedType === 'Salary'"></FormGeneralSalaryCompanyComponent>
          <FormGeneralReviewCompanyComponent @toggleSuccessRequest="toggleSuccessRequest" v-if="selectedType === 'Review'"></FormGeneralReviewCompanyComponent>
        </div>
      </div>
    </MainLayout>
  </div>
</template>

<style scoped>
</style>