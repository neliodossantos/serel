<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import router from "@/router";
import { onMounted } from "vue";

const { isDark, toggleTheme, initTheme } = useTheme();
const backToPage = () => {
  router.back();
}
onMounted(() => {
  initTheme();
});
</script>

<template>
    <div class="relative bg-[#FCFCFD] dark:bg-[#000e1c] w-screen md:h-screen min-h-dvh py-3 box-border flex justify-center md:items-center">
        <div class="box-border w-[90%] md:h-screen h-full relative py-[2rem] md:py-0">
          <div class="md:my-12 my-2">
            <a @click="backToPage" class="cursor-pointer items-center text-[#344054] font-[500] flex">
              <i class='bx bx-chevron-left text-3xl md:text-2xl text-white'></i>
              <span class="hidden md:block dark:text-white">Voltar à  página anterior</span>
            </a>
          </div>
          <div class="z-10 md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
              <slot></slot>
          </div>
        </div>
    </div>
</template>
<style scoped>
</style>