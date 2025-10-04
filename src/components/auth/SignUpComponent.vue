<script setup lang="ts">
import {reactive, ref, watch} from "vue";
import { validators } from "@/utils/validators/validators";
import { useRouter } from 'vue-router';
import {useUserStore} from "@/stores/users";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import {useToast} from "@/composables/useToast";

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const user = reactive({
  email: '' as string,
  password: '' as string,
  confirmPassword : '' as string
});

const errors = reactive({
  email: { message: '' , valid : true },
  password: { message: '' , valid : true },
  confirmPassword: { message: '' , valid : true },
})

const togglePassword = () =>{
  showPassword.value = !showPassword.value;
};
const toggleConfirmPassword = () =>{
  showConfirmPassword.value = !showConfirmPassword.value;
};

const validateForm = () => {
  errors.email =  validators.validateEmail(user.email);
  errors.password =  validators.validatePassword(user.password);
  errors.confirmPassword = validators.validateConfirmPassword(user.password,user.confirmPassword);
}

watch(() => user.email, () => { errors.email =  validators.validateEmail(user.email); } , { deep: true });
watch(() => user.password, () => { errors.password =  validators.validatePassword(user.password); } , { deep: true });
watch(() => user.confirmPassword, () => { errors.password =  validators.validateConfirmPassword(user.password,user.confirmPassword); } , { deep: true });


const emits = defineEmits(['redirectToComponent']);
const redirectToComponent = (value: string) => {
  emits('redirectToComponent',value);
};

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    validateForm();
    const success = Object.values(errors).every((error) => error.valid);
    if(!success) {
      toast.error(" Preencha todos os campos!", {position: 'top-left'});
      return;
    }
    const response = await userStore.signup(user);
    if(response.success){
      toast.success(response.message, {position: 'top-left'});
      setTimeout(() => { window.location.reload(); }, 4000);
    }else{
      toast.error(response.message, {position: 'top-left'});
    }
  }catch (e) {
    toast.error("Ocorreu um erro!", {position: 'top-left'});
  }finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <div class="md:px-10">
    <div class="mb-3">
      <h1 class="font-[700] text-2xl">Cria sua conta</h1>
      <p class="text-[14px] text-[#344054] font-[500]">Para usar o sistema, por favor informe os seus dados</p>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group mb-3">
        <label class="block font-bold mb-1 text-sm ">Email</label>
        <input v-model="user.email" :class="!errors.email.valid ? 'border-red-400 focus:ring-red-400' : ''" class="w-full p-2 border border-[#003F72] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="email">
        <span class="text-red-400 text-sm" v-if="!errors.email.valid">{{errors.email.message}}</span>
      </div>
      <div class="mb-3">
        <div class="relative">
          <label class="block font-bold mb-1 text-sm ">Palavra-passe</label>
          <input  v-model="user.password" :type="showPassword ? 'text' : 'password'" :class="!errors.password.valid ? 'border-red-400 focus:ring-red-400' : ''" class="w-full p-2 border border-[#003F72] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"/>
          <button type="button" @click="togglePassword" class="absolute inset-y-0 top-6 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg :class="!errors.password.valid ? 'text-red-400' : ''" v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <svg :class="!errors.password.valid ? 'text-red-400' : ''" v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
        </div>
        <span class="text-red-400 text-sm" v-if="!errors.password.valid">{{errors.password.message}}</span>
      </div>
      <div class="mb-3">
        <div class="relative">
          <label class="block font-bold mb-1 text-sm ">Confirmar Palavra-passe</label>
          <input  v-model="user.confirmPassword" :type=" showConfirmPassword ? 'text' : 'password'" :class="!errors.confirmPassword.valid ? 'border-red-400 focus:ring-red-400' : ''" class="w-full p-2 border border-[#003F72] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"/>
          <button type="button" @click="toggleConfirmPassword" class="absolute inset-y-0 top-6 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg :class="!errors.confirmPassword.valid ? 'text-red-400' : ''" v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <svg :class="!errors.confirmPassword.valid ? 'text-red-400' : ''" v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
        </div>
        <span class="text-red-400 text-sm" v-if="!errors.confirmPassword.valid">{{errors.confirmPassword.message}}</span>
      </div>
    </form>
    <div class="flex items-center justify-end mb-3">
      <span>Ja tens conta? <a class="underline text-[#344054] cursor-pointer" @click="redirectToComponent('login')">Inicie a sessão!</a></span>
    </div>
    <div class="form-group mb-3">
      <button @click="handleSubmit" class="flex items-center gap-3 justify-center mt-3 bg-[#003F72] text-white w-full py-[10px] px-[20px] rounded-lg font-bold" :class="{'disable' : isLoading }" :disabled="isLoading">
        {{ isLoading ? 'Processando...' : 'Criar conta'}}
        <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid"></div>
      </button>
    </div>
    <div class="hidden items-center gap-3 justify-between">
      <div class="w-full h-[1px] bg-[#EFEFEF]"></div>
      <span>OU</span>
      <div class="w-full h-[1px] bg-[#EFEFEF]"></div>
    </div>
    <div class="mt-3 hidden">
      <button class="flex gap-2 justify-center items-center border rounded-lg text-sm md:text-normal font-bold border-[#000] p-3 w-full">
        <img class="w-5 h-5" src="@/assets/img/gmail.png" alt="">
        Continuar com gmail
      </button>
      <button class="mt-3 flex gap-2 justify-center items-center border rounded-lg text-sm md:text-normal font-bold border-[#000] p-3 w-full">
        <img class="w-5 h-5" src="@/assets/img/logotipo-da-apple.png" alt="">
        Continuar com apple
      </button>
      <button class="mt-3 flex gap-2 justify-center items-center border rounded-lg text-sm md:text-normal font-bold border-[#000] p-3 w-full">
        <img class="w-5 h-5" src="@/assets/img/facebook.png" alt="">
        Continuar com facebook
      </button>
      <button class="mt-3 flex gap-2 justify-center items-center border rounded-lg font-bold border-[#000] text-sm md:text-normal p-3 w-full">
        <img class="w-5 h-5" src="@/assets/img/o-email.png" alt="">
        Continuar com email
      </button>
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