<script setup lang="ts">
import DashboardLayout from "@/layout/DashboardLayout.vue";
</script>
<template>
  <DashboardLayout>
    <h1 class="font-bold text-xl mb-5">Avaliações</h1>
    <div class="border-b-2">
      <ul class="flex gap-3">
        <li class="border-b-4 border-[#595959] px-5 py-2"><a class="font-bold" href="">Todos</a></li>
        <li class="p-2"><a class="text-[#2D2D2D]" href="">1 Aguardando avaliação</a></li>
        <li class="p-2"><a class="text-[#2D2D2D]" href="">0 Avaliado</a></li>
        <li class="p-2"><a class="text-[#2D2D2D]" href="">0 Recusado</a></li>
      </ul>
    </div>
    <div class="border-2 p-2 max-w-[460px] rounded mt-5">
      <label class="font-bold" for="">Ordenar por:</label>
      <select class="text-[#2D2D2D] px-2 outline-none">
        <option>Data da avaliação (mais recente primeiro)</option>
        <option>Data da avaliação (mais antiga)</option>
      </select>
    </div>
    <div class="w-full mt-5 border-b-2">
      <!-- Table for desktop -->
      <div class="w-full">
        <div class="hidden md:block">
          <table class="min-w-full divide-y divide-gray-400">
            <thead>
            <tr class="bg-gray-200">
              <th class="w-12 py-2">
                <input type="checkbox" class="rounded-md w-6 h-6 border-gray-300">
              </th>
              <th class="px-6 py-5 text-left text-sm font-bold tracking-wider">Utilizador</th>
              <th class="px-6 py-5 text-left text-sm font-bold tracking-wider">Empresa</th>
              <th class="px-6 py-5 text-left text-sm font-bold tracking-wider">Tipo de avaliação</th>
              <th class="px-6 py-5 text-left text-sm font-bold tracking-wider">Detalhes da Avaliação</th>
              <th class="px-6 py-5 text-left text-sm font-bold tracking-wider">Ações</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="i in 5" :key="i">
              <td class="px-6 py-4">
                <input type="checkbox" class="rounded-md w-6 h-6 border-gray-300">
              </td>
              <td class="px-6 py-4">Caio Teca</td>
              <td class="px-6 py-4">Sonangol</td>
              <td class="px-6 py-4">Salário</td>
              <td class="px-6 py-4">
                <div>Ótima equipe de pessoas para trabalhar...</div>
                <a href="/dashboard/review/1" class="underline font-bold">Ver detalhes</a>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2 items-center">
                  <div class="flex space-x-2 border-2 p-2 rounded">
                    <button>
                      <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13L9 17L19 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <button>
                      <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7.90039 8.07954C7.90039 3.30678 15.4004 3.30682 15.4004 8.07955C15.4004 11.4886 11.9913 10.8067 11.9913 14.8976" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 19.01L12.01 18.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- Cards for mobile -->
        <div class="md:hidden py-5 space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white p-4 rounded-lg shadow space-y-4">
            <div class="flex items-center justify-between">
              <input type="checkbox" class="rounded-md w-6 h-6 border-gray-300">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
              </button>
            </div>

            <div class="space-y-2">
              <div>
                <span class="font-bold">Utilizador:</span>
                <span>Caio Teca</span>
              </div>
              <div>
                <span class="font-bold">Empresa:</span>
                <span>Sonangol</span>
              </div>
              <div>
                <span class="font-bold">Tipo de avaliação:</span>
                <span>Salário</span>
              </div>
              <div>
                <span class="font-bold">Detalhes:</span>
                <div>Ótima equipe de pessoas para trabalhar...</div>
                <button class="underline">Ver detalhes</button>
              </div>
            </div>
            <div class="w-full flex justify-start">
              <div class="flex space-x-2 border-2 p-2 rounded">
                <button>
                  <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13L9 17L19 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
                <button>
                  <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M7.90039 8.07954C7.90039 3.30678 15.4004 3.30682 15.4004 8.07955C15.4004 11.4886 11.9913 10.8067 11.9913 14.8976" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 19.01L12.01 18.9989" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full flex justify-center items-center py-5 gap-5">
      <div class="flex items-center gap-2 border-2 rounded-md p-2">
        <button class="flex gap-2 items-center text-[#2D2D2D] font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
          </svg>
          Prev
        </button>
        <div class="">
          <button class="px-3 py-1 bg-[#003F72] border-none rounded-lg text-white">1</button>
        </div>
        <button class="flex gap-2 items-center text-[#2D2D2D] font-bold">
          Prox
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
          </svg>
        </button>
      </div>
      <div class="flex items-center gap-2 border-2 rounded-md p-2">
        <span>Showing</span>
        <div class="">
          <select class="pl-2 pr-5 text-[#2D2D2D] py-1 border rounded-md">
            <option>10</option>
            <option>20</option>
          </select>
        </div>
        <span>of 1 </span>
      </div>
    </div>
  </DashboardLayout>
</template>
<style scoped>
</style>