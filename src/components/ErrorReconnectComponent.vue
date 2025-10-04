<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
  message?: string;
  reloadButtonText?: string;
  customIcon?: string;
  errorCode?: number;
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Ops! Ocorreu um erro ao carregar os dados.',
  reloadButtonText: 'Tentar novamente',
  customIcon: '',
  errorCode: 0
});

const isOnline = ref(navigator.onLine);
const isVisible = ref(true);

const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

const reloadPage = () => {
  window.location.reload();
};

const closeError = () => {
  isVisible.value = false;
};

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<template>
  <div v-if="isVisible" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 p-4">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto overflow-hidden animate-fadeIn">
      <!-- Header com botão de fechar -->
      <div class="flex justify-end pt-4 px-4">
        <button @click="closeError" class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="px-6 pb-8 text-center">
        <!-- Ícones com melhor design -->
        <div v-if="customIcon" v-html="customIcon" class="mx-auto mb-6"></div>
        <div v-else-if="!isOnline" class="mx-auto mb-6">
          <div class="bg-red-50 p-3 rounded-full inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
          </div>
        </div>
        <div v-else class="mx-auto mb-6">
          <div class="bg-red-50 p-3 rounded-full inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <!-- Código de erro com design melhorado -->
        <div v-if="errorCode" class="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 mb-3">
          Código de erro: {{ errorCode }}
        </div>

        <!-- Mensagem principal com melhor tipografia -->
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          {{ !isOnline ? 'Sem conexão com a internet' : message }}
        </h3>
        <p class="text-gray-600 mb-8 max-w-sm mx-auto">
          {{ !isOnline ? 'Verifique sua conexão e tente novamente.' : 'Tente recarregar a página para resolver o problema.' }}
        </p>

        <!-- Botões com melhor design -->
        <div class="flex gap-3 justify-center">
          <button 
            @click="closeError" 
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Fechar
          </button>
          <button 
            @click="reloadPage" 
            class="px-5 py-2 bg-[#003F72] border border-transparent rounded-lg shadow-sm text-white font-medium hover:bg-[#002a4d] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#003F72] flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ reloadButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>

<style scoped>
/* Adicione estilos específicos do componente aqui, se necessário */
</style>
