<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import {useRoute} from "vue-router";
import {useCompanyStore} from "@/stores/companies";
import {onMounted, reactive, ref} from "vue";
import type {Company} from "@/types/Company";
import FormCompanyReviewComponent from "@/components/companies/reviews/FormCompanyReviewComponent.vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import {useToast} from "@/composables/useToast";
import ModalComponent from "@/components/ModalComponent.vue";
import ErrorReconnectComponent from "@/components/ErrorReconnectComponent.vue";

const route = useRoute();
const companyStore = useCompanyStore();
const company = reactive<Company>({});
const isLoading = ref(false);
const successRequest = ref(false);
const showToast = ref(false);
const toast = useToast();
const showWarningReview = ref(false);
const hasError = ref(false);
const errorMessage = ref('Não foi possível carregar as informações da empresa.');
const errorCode = ref(0);

onMounted(async () => {
  try {
    isLoading.value = true;
    hasError.value = false;

    // Verificar se está online
    if (!navigator.onLine) {
      hasError.value = true;
      errorMessage.value = 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
      return;
    }

    const companyId = route.params.companyId;
    const query = { filter: { id : companyId}, page : 1, limit: 5 };
    const response = await companyStore.getOne(query);

    if (!response || !response.data) {
      hasError.value = true;
      errorMessage.value = 'Não foi possível carregar as informações da empresa.';
      return;
    }

    Object.assign(company, response.data);
  } catch (e: any) {
    console.error(e);
    hasError.value = true;
    errorCode.value = e?.response?.status || 0;
    errorMessage.value = e?.response?.data?.message || 'Ocorreu um erro ao carregar os dados da empresa.';
  } finally {
    isLoading.value = false;

    if (!hasError.value) {
      showWarningReview.value = true;
      setTimeout(() => {
        showWarningReview.value = false;
      }, 30000);
    }
  }
});
function toggleSuccessRequest(value : boolean){
  successRequest.value = value;
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  },1000);
  setTimeout(()=>{
    showToast.value = true;
  },8000);
  setTimeout(()=>{
    window.location.href = `/overview/company/${company.id}`;
  },12000);
}
</script>
<template>
  <ErrorReconnectComponent 
    v-if="hasError" 
    :message="errorMessage"
    :error-code="errorCode"
    reload-button-text="Recarregar página"
  />
  <div v-else-if="successRequest">
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
                        class="bg-[#003F72] hover:bg-[#002a4d] text-white font-medium px-5 py-2 rounded-lg transition-colors"
                    >
                        Entendi, continuar
                    </button>
                </div>
            </div>
        </ModalComponent>
      <div class="w-full bg-[#F8FAFB] dark:bg-[#000e1c] min-h-[210px] mb-24 flex justify-center border-b border-[#D4D2D0] px-[12%]"></div>
      <div class=" w-full mb-24 px-[12%]">
        <div class="mx-auto relative max-w-[400px] sm:max-w-[600px] md:max-w-[900px]">
          <a class="left-0 xxs:-top-40 -top-44 absolute cursor-pointer" :href="`/overview/company/${company.id}`">
            <img class="xxs:max-w-32 max-w-44 min-h-full object-cover rounded block" :src="company.logo" :alt="`Logo da empresa ${company.name}`">
          </a>
          <FormCompanyReviewComponent @toggleSuccessRequest="toggleSuccessRequest" :currentCompany="company"></FormCompanyReviewComponent>
        </div>
      </div>
    </MainLayout>
  </div>
  <ToastContainer></ToastContainer>
</template>
<style scoped>
</style>