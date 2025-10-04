<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {validators} from "@/utils/validators/validators";
import {useUserStore} from "@/stores/users";
import {useToast} from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import {useCompanyStore} from "@/stores/companies";
import { useRoute } from "vue-router";

const emit = defineEmits(['toggleSuccessRequest']);
const toast = useToast();
const isLoading = ref(false);
const userStore = useUserStore();
const companyStore = useCompanyStore();
const route = useRoute();

    
const company = reactive({
  name : '',
  city: '' ,
  country: ''
});

const errors = reactive({
  name : { message : '' , valid : true },
  city: { message : '' , valid : true },
  country: { message : '' , valid : true }
});

watch(() => company.name, () => { errors.name = validators.validateName(company.name); },{ deep: true});
watch(() => company.city, () => { errors.city = validators.validateField(company.city,'Cidade'); },{ deep: true});
watch(() => company.country, () => {  errors.country = validators.validateField(company.country,'Pais'); },{ deep: true});

const validateForm = () => {
  errors.name = validators.validateName(company.name);
  errors.city = validators.validateField(company.city,'Cidade');
  errors.country = validators.validateField(company.country,'Pais');
}


const handleSubmit = async () => {
  try {
    isLoading.value = true;
    validateForm();
    const success = Object.values(errors).every((error) => error.valid);
    if(!success) {
      toast.error('Preencha todos os campos');
      return;
    }
    const response = await companyStore.requestCompany(company);
    emit('toggleSuccessRequest', response.success);
  }catch (e) {
    toast.error("Ocorreu um erro!");
  }finally {
    isLoading.value = false;
  }
}

onMounted(() => {
    if(route.query.name){
        company.name = route.query.name as string;
    }
});
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="py-5">
      <h2 class="text-xl md:text-3xl font-bold text-gray-300">Adicione a empresa onde trabalhas ou trabalhaste</h2>
      <p class="mb-6 max-w-[800px] mt-3 text-lg md:text-xl text-gray-300">Informe o nome da empresa e dados relevantes onde você está trabalhando atualmente ou onde já trabalhou.</p>
      <div @submit.prevent="handleSubmit" class="md:rounded-lg md:border-2 md:border-[#C3C6E5] flex flex-col gap-12 md:px-8 md:py-10">
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 text-gray-300">Nome</h3>
          <input v-model="company.name" placeholder="Digite o nome" class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.name.valid">{{errors.name.message}}</span>
        </div>
        <div class="flex gap-3 justify-between flex-wrap">
          <div class="flex-1">
            <h3 class="font-bold text-md sm:text-lg mb-2 text-gray-300">Cidade</h3>
            <input v-model="company.city" placeholder="Digite o cidade" class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
            <span class="text-red-400 mt-1" v-if="!errors.city.valid">{{errors.city.message}}</span>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-md sm:text-lg mb-2 text-gray-300">Pais</h3>
            <input v-model="company.country" placeholder="Digite o pais..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
            <span class="text-red-400 mt-1" v-if="!errors.country.valid">{{errors.country.message}}</span>
          </div>
        </div>
      </div>
      <div class="mt-6 w-full">
        <button type="submit" class="flex items-center gap-3 justify-center mt-3 bg-[#003F72] text-white w-full py-[10px] px-[20px] rounded-md font-bold" :class="{'disable' : isLoading }" :disabled="isLoading">
          {{ isLoading ? 'Processando...' : 'Confirmar'}}
          <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid"></div>
        </button>
      </div>
    </div>
  </form>
  <ToastContainer />
</template>
<style scoped>
.disable{
  background-color: #D1E9FF !important;
  color: #98A2B3;
}
</style>