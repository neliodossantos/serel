<script setup lang="ts">
import AuthLayout from "@/layout/AuthLayout.vue";
import { reactive, ref, watch } from "vue";
import {validators} from "@/utils/validators/validators";
import {useUserStore} from "@/stores/users";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import {useToast} from "@/composables/useToast";
import { useTheme } from "@/composables/useTheme";

const { isDark } = useTheme();
const toast = useToast();
const userStore = useUserStore();
const requestSuccessful = ref(false);
const isLoading = ref(false);
const email  = ref('');
const errors = reactive({
  email: { message: '' , valid : true }
});

const validateForm = () => {
  errors.email =  validators.validateEmail(email.value);
}

watch(() => email, validateForm , { deep: true });

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    validateForm();
    const success = Object.values(errors).every((error) => error.valid);
    if(!success) {
      toast.error(" Preencha todos os campos!");
      return;
    }
    const response = await userStore.forgetPassword(email.value);
    if(response.success){
      requestSuccessful.value = true;
    }else{
      toast.error(response.message);
    }
  }catch (e) {
    toast.error("Ocorreu um erro!");
  }finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <AuthLayout>
    <div class="py-[30px] md:py-[80px] md:px-[50px] bg-white dark:bg-transparent md:w-[460px] md:min-h-[300px] box-border mx-auto rounded-[16px] md:shadow-lg">
      <div class="mb-5">
        <a href="/">
            <img v-if="isDark" class="md:max-w-[160px] max-w-[150px]" src="@/assets/img/logo_white.png" alt="">
            <img v-else class="md:max-w-[160px] max-w-[150px]" src="@/assets/img/logo.png" alt="">
        </a>
      </div>
      <div v-if="!requestSuccessful" class="">
        <h1 class="my-1 font-[700] text-2xl dark:text-white">Esqueceu a palavra-passe?</h1>
        <p class="text-[14px] text-[#344054] font-[500] dark:text-gray-300">Insira o endereço de e-mail institucional, nós lhe enviaremos instruções para redefinir sua palavra-passe.</p>
        <form @submit.prevent="handleSubmit" class="">
          <div class="relative w-full flex flex-col mt-2 mb-2 gap-1">
            <span class="text-[#344054] text-[0.9rem] font-[500] dark:text-gray-300">Endereço de email</span>
            <input type="email" v-model="email" :class="!errors.email.valid ? 'border-red-400 focus:ring-red-400' : ''" class="w-full pl-[2.5rem] py-2.5 border  border-[#003F72] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-[14px]"
                   placeholder="Escreva aqui o seu email"/>
            <button type="button" class="absolute inset-y-0 top-7 left-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
              <i  :class="!errors.email.valid ? 'text-red-400' : ''" class='bx bx-envelope text-[24px] text-[#667085]'></i>
            </button>
          </div>
          <div class="">
            <span class="text-red-400 text-sm" v-if="!errors.email.valid">{{errors.email.message}}</span>
          </div>
          <div class="mt-6">
            <button type="submit" :disabled="isLoading" :class="{'disable' : isLoading }"  class="flex items-center gap-3 justify-center mt-3 bg-[#003F72] text-white w-full py-[10px] px-[20px] rounded-[12px] font-bold">
              {{ isLoading ? 'Processando...' : 'Recuperar'}}
              <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid"></div>
            </button>
          </div>
        </form>
      </div>
      <div v-else class="transition-all transition-duration-300">
        <h2 class="text-2xl font-bold text-[#003F72]">E aí! Verifique o seu email 🎉</h2>
        <p class="text-sm">Nós enviamos um e-mail com instruções sobre como recuperar sua senha. Verifique sua caixa de entrada ou a pasta de spam.</p>
        <div class="flex h-[150px] justify-center">
          <img class="max-w-full h-[250px] object-cover" src="@/assets/img/Mail-rafiki.svg" alt="">
        </div>
      </div>
    </div>
  </AuthLayout>
  <ToastContainer></ToastContainer>
</template>
<style scoped>
.disable{
  background-color: #D1E9FF !important;
  color: #98A2B3;
}
</style>