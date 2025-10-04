<script setup lang="ts">
import AuthLayout from "@/layout/AuthLayout.vue";
import { ref } from "vue";

const code = ref(["", "", "", "", "", ""]);
const isLoading = ref(false);

const handleInput = (index: number, event: any) => {
  const value = event.target.value;
  if (!/^\d$/.test(value)) {
    code.value[index] = "";
    return;
  }
  if (value && index < code.value.length - 1) {
    const inputs = event.target.closest('.code-inputs').querySelectorAll('input');
    if (inputs[index + 1]) {
      inputs[index + 1].focus();
      inputs[index + 1].select();
    }
  }
};
const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace' && index > 0 && code.value[index] === '') {
    const target = event.target as HTMLElement | null;
    if (target) {
      const inputs = target.closest('.code-inputs')?.querySelectorAll('input');
      if (inputs && inputs[index - 1]) {
        (inputs[index - 1] as HTMLInputElement).focus();
        (inputs[index - 1] as HTMLInputElement).select();
      }
    }
  }
}
</script>
<template>
  <AuthLayout>
    <div class="py-[30px] md:py-[80px] md:px-[50px] md:bg-white md:w-[460px] md:min-h-[300px] box-border mx-auto md:rounded-[16px] md:shadow">
      <div class="mb-5">
        <a href="/">
          <img class="md:max-w-[160px] max-w-[150px]" src="@/assets/img/logo.png" alt="">
        </a>
      </div>
      <h1 class="font-bold text-2xl">Confirme a sua identidade</h1>
      <p class="text-[#344054]">Insira o código que enviamos para
        <span class="font-bold text-[#344054]">ray.developper@gmail.com</span>
      </p>
      <div class="w-full">
        <div class="w-full code-inputs flex mt-3 justify-center items-center">
          <div v-for="(value, index) in code" :key="index" class="mx-1 flex items-center w-full">
            <input type="text" placeholder="0" maxlength="1"
                class="w-[50px] h-[50px] text-center border flex-1 outline-none border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-lg font-bold placeholder:text-[#ccc] placeholder:text-[24px]"
                v-model="code[index]" @input="handleInput(index, $event)" @keydown="handleKeyDown(index, $event)"
                :autofocus="index === 0"
            />
            <label v-if="index === 2" class="ml-2 self-center text-2xl font-bold">-</label>
          </div>
        </div>
        <div class="md:justify-self-end md:self-end my-3">
          <span class="text-sm">Não recebeu o código ? </span>
          <a class="text-sm underline" href="">Reenviar</a>
        </div>
      </div>
      <div>
        <button :disabled="isLoading" :class="{'opacity-50 cursor-not-allowed': isLoading}" class="flex items-center gap-3 justify-center mt-3 bg-[#F9FAFB] border text-[#1D2939] w-full py-[10px] px-[20px] rounded-xl font-bold shadow">
          {{ isLoading ? 'Processando...' : 'Alterar email'}}
          <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-[#1D2939] border-solid"></div>
        </button>
      </div>
    </div>
  </AuthLayout>
</template>
<style scoped></style>