<script setup lang="ts">
import ItemMostSearchedCompanies from "@/components/companies/list/item/ItemMostSearchedCompaniesComponent.vue";
import {useUserStore} from "@/stores/users";
import {onMounted, ref} from "vue";
import router from "@/router";
import ModalAuth from "@/components/auth/ModalAuth.vue";
import {useCompanyStore} from "@/stores/companies";
import ItemCompanySkeleton from "@/components/skeleton/ItemCompanySkeleton.vue";
import type {Company} from "@/types/Company";
import NoDataComponent from "@/components/NoDataComponent.vue";
import {useToast} from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";

const isLoading = ref(false);
const userStore = useUserStore();
const showModalUser = ref(false);
const companyStore = useCompanyStore();
const companies = ref<Company[]>([]);
const isEmpty = ref(false);
const toast  = useToast();

const goToOverviewCompany = (id:number) =>{
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
    const query = { filter: {}, page: 2, limit : 3 };
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
  <div class="px-[12%] sm:pt-8 pb-10 bg-[#F9F9F9] dark:bg-[#000e1c]">
    <div class="flex items-center">
      <h1 class="xxs:text-lg text-xl sm:text-2xl mt-10 3xl:text-3xl font-bold dark:text-white"> Mais Pesquisadas </h1>
    </div>
    <div class="grid pb-10 mt-10 gap-y-10 sm:gap-y-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-stretch gap-x-10">
      <ItemCompanySkeleton v-if="isLoading && !isEmpty" v-for="i in 3"></ItemCompanySkeleton>
      <NoDataComponent class="col-span-3" v-else-if="!isLoading && isEmpty"></NoDataComponent>
      <ItemMostSearchedCompanies v-else v-for="company in companies" :key="company.id" :company="company"
       @goToOverviewCompany="goToOverviewCompany"/>
    </div>
  </div>
  <ModalAuth :modal-value="showModalUser" @close="showModalUser=false;"></ModalAuth>
  <ToastContainer/>
</template>
<style scoped>
</style>