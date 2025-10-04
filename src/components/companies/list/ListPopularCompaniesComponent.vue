<script setup lang="ts">
import ItemPopularCompanies from "@/components/companies/list/item/ItemPopularCompaniesComponent.vue";
import {onMounted, ref} from "vue";
import ModalAuth from "@/components/auth/ModalAuth.vue";
import {useUserStore} from "@/stores/users";
import router from "@/router";
import {useCompanyStore} from "@/stores/companies";
import PopularCompanySkeleton from "@/components/skeleton/PopularCompanySkeleton.vue";
import NoDataComponent from "@/components/NoDataComponent.vue";
import type {Company} from "@/types/Company";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import {useToast} from "@/composables/useToast";

const isLoading = ref(false);
const userStore = useUserStore();
const showModalUser = ref(false);
const companyStore = useCompanyStore();
const companies = ref<Company[]>([]);
const isEmpty = ref(false);
const toast = useToast();
const goToOverviewCompany = (id:string) =>{
  if(userStore.isLogged()){
    showModalUser.value = false;
    router.push('/overview/company/' + id);
  }else{
    localStorage.setItem('redirect', `/overview/company/${id}`);
    showModalUser.value = true;
  }
}
onMounted(async () =>{
  try {
    isLoading.value = true;
    const query = { filter: {}, page: 1, limit : 6 };
    const response = await companyStore.getAll(query);
    if(response.data){
      companies.value = response.data.companies;
    }else{
      isEmpty.value = true;
    }
  }catch (e) {
    toast.error("Ocorreu um erro!" + e);
  }finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div class="mb-10 sm:mb-32 mt-16 px-[12%] w-full dark:bg-gray-900">
    <div class="flex justify-between items-center">
      <h1 class="xxs:text-lg text-xl sm:text-2xl font-bold 3xl:text-3xl dark:text-white"> Empresas populares </h1>
      <a class="underline md:text-md 2xl:text-[16px] 3xl:text-lg text-sm dark:text-white" href="/filter">Ver todos</a>
    </div>
    <div class="grid pb-10 mt-10 gap-y-10 sm:gap-y-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-stretch gap-x-10">
      <PopularCompanySkeleton v-if="isLoading && !isEmpty" v-for="i in 3"></PopularCompanySkeleton>
      <NoDataComponent class="col-span-3" v-else-if="!isLoading && isEmpty"></NoDataComponent>
      <ItemPopularCompanies v-else v-for="company in companies" :key="company.id" :company="company"
          @goToOverviewCompany="goToOverviewCompany"/>
    </div>
  </div>
  <ModalAuth :modal-value="showModalUser" @close="showModalUser=false;"></ModalAuth>
  <ToastContainer />
</template>
<style scoped>
</style>