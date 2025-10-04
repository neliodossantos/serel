<script setup lang="ts">
import FormContactComponent from "@/components/FormContactComponent.vue";
import MainLayout from "@/layout/MainLayout.vue";
import {onMounted , ref } from "vue";
import PreloaderComponent from "@/components/PreloaderComponent.vue";

const isLoading = ref(true);
onMounted( ()=>{
  setTimeout(()=>{
    isLoading.value = false;
  },1000);
});
</script>

<template>
  <PreloaderComponent v-if="isLoading"></PreloaderComponent>
  <MainLayout v-else>
    <div class="w-full bg-[#F8FAFB] dark:bg-[#000e1c] min-h-[210px] mb-24 flex justify-center border-b border-[#D4D2D0] px-[12%]"></div>
    <div class=" w-full mb-24 px-[12%]">
      <div class="mx-auto relative max-w-[400px] sm:max-w-[600px] md:max-w-[900px]">
        <a class="left-0 xxs:-top-40 -top-44 absolute cursor-pointer">
          <img class="xxs:max-w-24 max-w-32 min-h-full object-cover rounded block" src="@/assets/img/logo_alternativo_serel.png" alt="Logo da empresa Serel">
        </a>
        <FormContactComponent></FormContactComponent>
      </div>
    </div>
  </MainLayout>
</template>
<style scoped>
</style>