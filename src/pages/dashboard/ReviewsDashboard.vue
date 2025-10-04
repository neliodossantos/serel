<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import DashboardLayout from "@/layout/DashboardLayout.vue";
import { useReviewStore } from '@/stores/reviews';
import type { Review } from '@/types/Review';
import { useRouter } from 'vue-router';

const reviewStore = useReviewStore();
const router = useRouter();

const reviews = ref<Review[]>([]);
const loading = ref(false);
const activeTab = ref<'all' | 'in_review' | 'approved' | 'rejected'>('all');
const filterStatus = ref('');

const fetchReviews = async (filters = {}) => {
  loading.value = true;
  try {
    const response = await reviewStore.getAll(filters);
    if (response.success && response.data) {
      reviews.value = response.data.data || [];
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const applyFilter = () => {
  const filters: any = {};
  if (filterStatus.value) {
    filters.status = filterStatus.value;
  }
  fetchReviews(filters);
};

const filteredReviews = computed(() => {
  if (activeTab.value === 'all') return reviews.value;
  return reviews.value.filter(r => r.status === activeTab.value);
});

const tabCounts = computed(() => ({
  all: reviews.value.length,
  in_review: reviews.value.filter(r => r.status === 'in_review').length,
  approved: reviews.value.filter(r => r.status === 'approved').length,
  rejected: reviews.value.filter(r => r.status === 'rejected').length,
}));

const setTab = (tab: typeof activeTab.value) => {
  activeTab.value = tab;
};

const viewDetails = (reviewId: string) => {
  router.push(`/dashboard/review/${reviewId}`);
};

const approveReview = async (reviewId: string) => {
  const response = await reviewStore.updateStatus({ id: reviewId, status: 'approved' });
  if (response.success) {
    applyFilter(); // Refresh with filters
  }
};

const rejectReview = async (reviewId: string) => {
  const response = await reviewStore.updateStatus({ id: reviewId, status: 'rejected' });
  if (response.success) {
    applyFilter(); // Refresh with filters
  }
};

onMounted(() => {
  fetchReviews();
});
</script>
<template>
  <DashboardLayout>
    <h1 class="font-bold text-xl mb-5">Avaliações</h1>
    <div class="mb-5">
      <div class="border-2 p-2 max-w-[460px] rounded">
        <label class="font-bold" for="">Filtrar por:</label>
        <select class="text-[#2D2D2D] px-2 outline-none" v-model="filterStatus" @change="applyFilter">
          <option value="">Todos os status</option>
          <option value="in_review">Aguardando avaliação</option>
          <option value="approved">Aprovado</option>
          <option value="rejected">Rejeitado</option>
        </select>
      </div>
    </div>
    <div class="border-b-2">
      <ul class="flex gap-3">
        <li :class="activeTab === 'all' ? 'border-b-4 border-[#595959]' : ''" class="px-5 py-2 cursor-pointer" @click="setTab('all')">
          <a class="font-bold">Todos ({{ tabCounts.all }})</a>
        </li>
        <li :class="activeTab === 'in_review' ? 'border-b-4 border-[#595959]' : ''" class="p-2 cursor-pointer" @click="setTab('in_review')">
          <a class="text-[#2D2D2D]">Aguardando avaliação ({{ tabCounts.in_review }})</a>
        </li>
        <li :class="activeTab === 'approved' ? 'border-b-4 border-[#595959]' : ''" class="p-2 cursor-pointer" @click="setTab('approved')">
          <a class="text-[#2D2D2D]">Aprovado ({{ tabCounts.approved }})</a>
        </li>
        <li :class="activeTab === 'rejected' ? 'border-b-4 border-[#595959]' : ''" class="p-2 cursor-pointer" @click="setTab('rejected')">
          <a class="text-[#2D2D2D]">Recusado ({{ tabCounts.rejected }})</a>
        </li>
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
        <div v-if="loading" class="text-center py-5">Carregando...</div>
        <div v-else-if="filteredReviews.length === 0" class="text-center py-5">Nenhuma avaliação encontrada.</div>
        <div v-else class="hidden md:block">
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
            <tr v-for="review in filteredReviews" :key="review.id">
              <td class="px-6 py-4">
                <input type="checkbox" class="rounded-md w-6 h-6 border-gray-300">
              </td>
              <td class="px-6 py-4">{{ review.userId }}</td>
              <td class="px-6 py-4">{{ review.companyId }}</td>
              <td class="px-6 py-4">Avaliação</td>
              <td class="px-6 py-4">
                <div>{{ review.comment.comment }}</div>
                <a @click="viewDetails(review.id)" class="underline font-bold cursor-pointer">Ver detalhes</a>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2 items-center">
                  <div class="flex space-x-2 border-2 p-2 rounded">
                    <button v-if="review.status === 'in_review'" @click="approveReview(review.id)">
                      <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13L9 17L19 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <button v-if="review.status === 'in_review'" @click="rejectReview(review.id)">
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
          <div v-for="review in filteredReviews" :key="review.id" class="bg-white p-4 rounded-lg shadow space-y-4">
            <div class="flex items-center justify-between">
              <input type="checkbox" class="rounded-md w-6 h-6 border-gray-300">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
              </button>
            </div>

            <div class="space-y-2">
              <div>
                <span class="font-bold">Utilizador:</span>
                <span>{{ review.userId }}</span>
              </div>
              <div>
                <span class="font-bold">Empresa:</span>
                <span>{{ review.companyId }}</span>
              </div>
              <div>
                <span class="font-bold">Tipo de avaliação:</span>
                <span>Avaliação</span>
              </div>
              <div>
                <span class="font-bold">Detalhes:</span>
                <div>{{ review.comment.comment }}</div>
                <button @click="viewDetails(review.id)" class="underline">Ver detalhes</button>
              </div>
            </div>
            <div class="w-full flex justify-start">
              <div class="flex space-x-2 border-2 p-2 rounded">
                <button v-if="review.status === 'in_review'" @click="approveReview(review.id)">
                  <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13L9 17L19 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
                <button v-if="review.status === 'in_review'" @click="rejectReview(review.id)">
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