<script setup lang="ts">
import AuthLayout from "@/layout/AuthLayout.vue";
import { onMounted, reactive, ref, watch} from "vue";
import {validators} from "@/utils/validators/validators";
import {useUserStore} from "@/stores/users";
import router from "@/router";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import {useToast} from "@/composables/useToast";
import { useTheme } from "@/composables/useTheme";

const { isDark } = useTheme();
const toast = useToast();
const userStore = useUserStore();
const isValidResetPasswordToken = ref(false);
const isLoadingPage = ref(false);
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const user = reactive({
  password: '' as string,
  confirmPassword : '' as string
});

const errors = reactive({
  password: { message: '' , valid : true },
  confirmPassword: { message: '' , valid : true },
});
const togglePassword = () =>{
  showPassword.value = !showPassword.value;
};
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

watch(() => user.password, () => { errors.password =  validators.validatePassword(user.password); } , { deep: true });
watch(() => user.confirmPassword, () => { errors.confirmPassword =  validators.validateConfirmPassword(user.confirmPassword,user.password); } , { deep: true });


const validateForm = () => {
  errors.password = validators.validatePassword(user.password);
  errors.confirmPassword =  validators.validateConfirmPassword(user.password,user.confirmPassword);
}

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    validateForm();
    const success = Object.values(errors).every((error) => error.valid);
    if(!success) {
      toast.error(" Preencha os campos!");
      return;
    }
    const response = await userStore.resetPassword(user);
    if(response.success){
      toast.success(response.message);
      setTimeout(()=>{ router.push('/login') },3000);
    }else{
      toast.error(response.message);
    }
  }catch (e) {
    toast.error("Ocorreu um erro!");
    console.log(e);
  }finally {
    isLoading.value = false;
  }
}
onMounted(async () => {
  try {
    isLoadingPage.value = true;
    isValidResetPasswordToken.value =  await userStore.isValidResetPasswordToken();
  }catch (e){
    console.log(e);
  }finally {
    isLoadingPage.value = false;
  }
});
</script>
<template>
  <PreloaderComponent v-if="isLoadingPage"></PreloaderComponent>
  <div v-else class="">
    <AuthLayout v-if="isValidResetPasswordToken">
      <div class="py-[30px] md:py-[40px] md:px-[50px] md:bg-white dark:bg-transparent md:w-[460px] md:min-h-[380px] box-border mx-auto md:rounded-[16px] md:shadow-lg">
        <div class="mb-5">
          <a href="/">
            <img class="md:max-w-[160px] max-w-[150px]" src="@/assets/img/logo.png" alt="">
          </a>
        </div>
        <h1 class="my-1 font-[700] text-2xl">Defina uma nova palavra-passe </h1>
        <p class="text-[14px] text-[#344054] font-[500]">A senha deve ter no mínimo 8 caracteres e incluir ao menos uma letra minúscula.</p>
        <form @submit.prevent="handleSubmit" class="">
          <div class="w-full mt-2 mb-2">
            <div class="relative flex flex-col gap-1">
              <span class="text-[#344054] text-sm font-[500]">Palavra-passe</span>
              <input v-model="user.password" :type="showPassword ? 'text' : 'password'" :class="!errors.password.valid ? 'border-red-400 focus:ring-red-400' : ''" class="w-full px-4 py-2 border border-[#003F72] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Repete a palavra-passe"/>
              <button type="button" @click="togglePassword" :class="!errors.password.valid ? 'border-red-400 focus:ring-red-400' : ''" class="absolute inset-y-0 top-7 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
            <span class="text-red-400 text-sm" v-if="!errors.password.valid">{{errors.password.message}}</span>
          </div>
          <div class="w-full mb-2">
            <div class="relative flex flex-col gap-1">
              <span class="text-[#344054] text-sm font-[500]">Confirmação da Palavra-passe</span>
              <input v-model="user.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" :class="!errors.confirmPassword.valid ? 'border-red-400 focus:ring-red-400' : ''" class="w-full px-4 py-2 border border-[#003F72] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder="Repete a palavra-passe"/>
              <button type="button" @click="toggleConfirmPassword" class="absolute inset-y-0 top-7 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              </button>
            </div>
            <span class="text-red-400 text-sm" v-if="!errors.confirmPassword.valid">{{errors.confirmPassword.message}}</span>
          </div>
          <div class="">
            <button type="submit" :disabled="isLoading" :class="{'disable' : isLoading }"  class="flex items-center gap-3 justify-center mt-4 bg-[#003F72] text-white w-full py-[10px] px-[20px] rounded-[12px] font-bold">
              {{ isLoading ? 'Processando...' : 'Confirmar'}}
              <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid"></div>
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
    <div v-else class="w-full h-screen flex items-center justify-center">
      <div class="flex px-10 md:px-0 md:flex-row flex-col-reverse items-center md:gap-10">
        <div class="md:w-[800px] py-10">
          <a href="/">
            <img class="max-w-44 mb-5" src="@/assets/img/logo.png" alt="">
          </a>
          <div class="flex flex-col justify-center max-w-[380px]">
            <h2 class="font-bold text-2xl">Token Expirou!</h2>
            <p class="mt-2">Desculpe, mas o seu token expirou para renovar o token clica em recuperar a conta e introduza o seu email.</p>
            <a href="/forgot-password" class="mt-5 bg-[#003F72] py-2 block max-w-[350px] text-center rounded text-white">Recuperar a conta</a>
          </div>
        </div>
        <img class="max-w-[400px]" src="@/assets/img/Warning-rafiki.svg" alt="">
      </div>
    </div>
  </div>
  <ToastContainer></ToastContainer>
</template>
<style scoped>
.disable{
  background-color: #D1E9FF !important;
  color: #98A2B3;
}
</style>