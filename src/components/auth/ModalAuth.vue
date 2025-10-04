<script setup lang="ts">
import LoginComponent from "@/components/auth/LoginComponent.vue";
import SignupComponent from "@/components/auth/SignUpComponent.vue";
import { ref } from 'vue';

defineProps({
  modalValue : {type : Boolean , required: true }
});

const loadComponents = ['signup','login','forgot-password','reset-password'];
const getValueRedirectComponent = ref('login');
function getRedirectComponent(value:string){
  loadComponents.forEach((l) => {
      if(value === l){
        getValueRedirectComponent.value = value;
      }
  });
}
</script>
<template>
  <div v-if="modalValue" class="relative z-50">
    <div class="fixed inset-0 bg-[#1D1D1BBF] opacity-75"></div>
    <nav class="fixed top-0 right-0 bottom-0 flex flex-col w-full md:w-[50%] lg:w-[40%] 3xl:w-[35%] py-4 md:px-10 px-5 bg-white border-r overflow-y-auto">
      <div class="flex flex-col items-end  mb-2">
        <button class="navbar-close mt-3" @click="$emit('close')">
          <svg class="h-8 w-8 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <LoginComponent v-if="getValueRedirectComponent === 'login'" @redirectToComponent="getRedirectComponent"></LoginComponent>
      <SignupComponent class="transition-all transition-duration-300" v-if="getValueRedirectComponent === 'signup'" @redirectToComponent="getRedirectComponent"></SignupComponent>
    </nav>
  </div>
</template>
<style scoped>
</style>