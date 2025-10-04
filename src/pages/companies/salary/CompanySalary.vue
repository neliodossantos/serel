<script setup lang="ts">
import router from "@/router";
import {onMounted, reactive, ref} from "vue";
import MainLayout from "@/layout/MainLayout.vue";
import CompanySalaryComponent from "@/components/companies/salary/CompanySalaryComponent.vue";
import ListRelatedCompanies from "@/components/companies/list/ListRelatedCompaniesComponent.vue";
import SearchSalaryComponent from "@/components/companies/salary/SearchSalaryComponent.vue";
import {useRoute} from "vue-router";
import {useCompanyStore} from "@/stores/companies";
import type {Company} from "@/types/Company";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import {useUserStore} from "@/stores/users";
import ErrorReconnectComponent from "@/components/ErrorReconnectComponent.vue";

const route = useRoute();
const companyStore = useCompanyStore();
const userStore = useUserStore();
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('Não foi possível carregar as informações da empresa.');
const errorCode = ref(0);
const company = reactive<Company>({});

const roleSearch = ref('');
const placeSearch = ref('');
const isSearching = ref(false);

const filledStars =(rating: number) => Math.floor(rating ?? 0);
const hasHalfStar =(rating: number) => (rating ?? 0) % 1 >= 0.5;
const emptyStars = (rating: number) => {
  const hadHalfStar = hasHalfStar(rating);
  const fillStars = filledStars(rating);
  return 5 - fillStars - (hadHalfStar ? 1 : 0);
};

const emit = defineEmits(['search']);

function handleInput() {
  isSearching.value = roleSearch.value !== "" || placeSearch.value !== "";
  emit('search', {
    role: roleSearch.value,
    place: placeSearch.value
  });
}

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
    const response = await companyStore.getOne({ filter: { id : companyId}, page : 1, limit: 1 });

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
  }
});
</script>
<template>
  <ErrorReconnectComponent 
    v-if="hasError" 
    :message="errorMessage"
    :error-code="errorCode"
    reload-button-text="Recarregar página"
  />
  <PreloaderComponent v-else-if="isLoading"></PreloaderComponent>
  <MainLayout v-else>
    <div class="w-full bg-[#F8FAFB] flex items-center md:border-none border-b border-[#D4D2D0] md:py-0 dark:bg-[#000e1c] dark:text-white">
      <div class="w-full mt-10 md:mt-20 min-h-auto px-[12%]">
        <div class="flex lg:gap-16 justify-between items-center flex-wrap gap-4 xs:gap-2">
          <div class="flex items-start gap-5">
            <img @click="router.push('/overview/company/' + company.id)" class="mt-1.5 sm:mt-0 cursor-pointer xxs:max-w-20 xxs:max-h-20 xs:w-24 xs:h-24 w-32 h-32 object-cover rounded" :src="company.logo" :alt="'Logo da empresa' + company.name">
            <div class="xs:mb-2">
              <h2 class="xs:text-base font-600 text-xl sm:mb-2">{{company.name}}</h2>
              <span class="xxs:hidden xs:text-sm text-md"><i class='bx bx-map mr-1'></i>{{company.address?.city}}, {{company.address?.country}}</span>
              <div class="flex my-1 sm:my-2 items-center xxs:gap-0 gap-1 flex-wrap">
                <i v-for="n in filledStars(company.rating?.average ?? 0)" :key="'filled-' + n" class="bx bxs-star text-xl sm:text-2xl text-[#003F72]"></i>
                <i v-if="hasHalfStar(company.rating?.average ?? 0)" class="bx bxs-star-half text-[#003F72] text-xl sm:text-2xl"></i>
                <i v-for="n in emptyStars(company.rating?.average ?? 0)" :key="'empty-' + n" class="bx bx-star text-xl sm:text-2xl text-[#003F72]"></i>
                <div class="">
                  <span class="xxs:text-sm text-md ml-1">{{company.rating?.average ?  company.rating?.average : 0 }}/5</span>
                </div>
              </div>
              <span class="block xs:hidden text-sm text-gray-500 underline dark:text-gray-200">{{company.sector}}</span>
            </div>
          </div>
          <div class="w-full xs:max-w-72 sm:max-w-md rounded md:w-auto">
            <a :href="`/company/${company.id}/salary`" class="max-w-full text-center block lg:inline bg-[#003F72] py-[12px] md:py-[18px] md:px-[45px] rounded text-white border-none">Avaliar sálario</a>
          </div>
        </div>
        <div class="xs:my-5 my-10">
          <div class="">
            <ul class="md:border-b md:border-gray-300 flex gap-3">
              <li class="list-none pb-1"><a :href="'/overview/company/' + company.id" class="cursor-pointer text-[#003F72] text-md  py-4 font-bold dark:text-blue-500">Visão Geral</a></li>
              <li class="list-none pb-1"><a :href="'/reviews/company/' + company.id" class="cursor-pointer text-[#003F72] text-md  py-3 font-bold dark:text-blue-500">Avaliações</a></li>
              <li class="list-none pb-1 border-b-[4px] border-[#003F72] dark:border-blue-500"><a :href="'/salaries/company/' + company.id" class="cursor-pointer text-[#003F72] text-md  py-3 font-bold dark:text-blue-500">Salários</a></li>
            </ul>
          </div>
        </div>
        <div class="mb-10 md:my-10">
          <div class="flex sm:gap-8 gap-5 flex-wrap sm:flex-nowrap">
            <div class="w-full">
              <label class="font-bold text-sm sm:text-base mb-1 block">Cargo:</label>
              <div class="relative">
                <input type="text" v-model="roleSearch" @input="handleInput" placeholder="Cargos" class="p-3 pr-3 border border-[#D4D2D0] bg-white focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent rounded-md w-full ">
                <div class="absolute right-3 bottom-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <div class="hidden max-h-56 overflow-y-auto scrollbar-rounded absolute top-14  border-2 rounded-md px-3 py-2 bg-white w-full">
                  <div class="my-2" v-for="items in 5">
                    <div class="flex gap-2 items-center">
                      <h3 class="text-md font-bold">Administração</h3>
                      <span class="text-[#595959] mt-1 text-sm">30 salários</span>
                    </div>
                    <div class="pl-3">
                      <div class="flex gap-3">
                        <h3 class="text-sm">Assistente administrativo</h3>
                        <span class="text-[#595959] text-sm">30 salários</span>
                      </div>
                      <div class="flex gap-3">
                        <h3 class="text-sm">Assistente administrativo</h3>
                        <span class="text-[#595959] text-sm">30 salários</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CompanySalaryComponent :searchQuery="{ role: roleSearch, place: placeSearch }"
                              @update:search="handleInput"  :currentCompany="company">
    </CompanySalaryComponent>
    <ListRelatedCompanies :currentCompany="company || null"></ListRelatedCompanies>
  </MainLayout>
</template>
<style scoped></style>
