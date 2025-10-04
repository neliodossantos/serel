<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardLayout from "@/layout/DashboardLayout.vue";
import router from "@/router";
import { useReviewStore } from '@/stores/reviews';
import type { Review } from '@/types/Review';

const reviewStore = useReviewStore();
const review = ref<Review | null>(null);
const loading = ref(false);

const reviewId = router.currentRoute.value.params.id as string;

const backToPage = () => {
  router.back();
};

const fetchReview = async () => {
  loading.value = true;
  try {
    const response = await reviewStore.getOne({ id: reviewId });
    if (response.success) {
      review.value = response.data;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const approveReview = async () => {
  if (!review.value) return;
  const response = await reviewStore.updateStatus({ id: review.value.id, status: 'approved' });
  if (response.success) {
    await fetchReview();
  }
};

const rejectReview = async () => {
  if (!review.value) return;
  const response = await reviewStore.updateStatus({ id: review.value.id, status: 'rejected' });
  if (response.success) {
    await fetchReview();
  }
};

const updateStatus = async () => {
  if (!review.value) return;
  const response = await reviewStore.updateStatus({ id: review.value.id, status: review.value.status });
  if (response.success) {
    // Status updated
  }
};

onMounted(() => {
  fetchReview();
});
</script>

<template>
  <DashboardLayout>
    <h1 class="font-bold text-xl mb-5">Avaliações</h1>
    <div class="">
      <a @click="backToPage" class="my-2 flex font-bold gap-2 items-center cursor-pointer text-[#003F72]">
        <i class='bx bx-arrow-back text-black text-md' ></i>Voltar
      </a>
    </div>
    <div v-if="loading" class="text-center">Carregando...</div>
    <div v-else-if="!review" class="text-center">Avaliação não encontrada.</div>
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-7 xl:gap-x-14">
      <div class="lg:col-span-2 xl:col-span-3">
        <div class="p-2 lg:py-0 py-5 flex flex-wrap items-start justify-between border-b w-full">
          <div class="">
            <h2 class="text-[#2D2D2D] font-bold text-3xl">{{ review.userId }}</h2>
            <span class="text-[#2D2D2D] underline mb-3 block">{{ review.userId }}@email.com</span>
          </div>
          <div class="flex w-full md:w-auto justify-between  space-x-2">
            <div class="border-2 flex justify-between gap-2 p-2 rounded">
              <button v-if="review.status === 'in_review'" @click="approveReview">
                <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13L9 17L19 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
              </button>
              <button v-if="review.status === 'in_review'" @click="rejectReview">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <button class="justify-self-end">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" /></svg>
            </button>
          </div>
        </div>
        <div class="w-full">
          <div class="py-5 space-y-4">
            <div class="bg-white p-4 space-y-4">
              <h2 class="font-bold text-2xl">Avaliação - {{ review.companyId }}</h2>
              <div class="space-y-2">
                <div class="flex gap-1">
                  <img v-for="i in Math.floor(review.score)" :key="'fill-' + i" class="w-6 h-6" src="@/assets/img/star_fill.svg" alt="">
                  <img v-for="i in (5 - Math.floor(review.score))" :key="'outline-' + i" class="w-6 h-6" src="@/assets/img/star_outline.svg" alt="">
                </div>
                <div>
                  <h2>{{ review.reviewTitle }}</h2>
                  <p class="text-[#595959]">{{ review.comment.comment }}</p>
                </div>
                <div>
                  <div class="mb-2">
                    <p class="text-[#595959] font-bold">Recomendaria?</p>
                    <span>{{ review.recommend ? 'Sim' : 'Não' }}.</span>
                  </div>
                  <div class="mb-2">
                    <p class="text-[#595959] font-bold">Aspectos Positivos?</p>
                    <span>{{ review.comment.positiveAspects }}</span>
                  </div>
                  <div class="mb-2">
                    <p class="text-[#595959] font-bold">Aspectos Negativo?</p>
                    <span>{{ review.comment.negativeAspects }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-[#FAF9F8] min-w-64 rounded-md p-3">
        <div class="pl-5 bg-white border rounded-md">
          <label class="block text-[#2D2D2D] font-bold pt-2">Status:</label>
          <select class="p-3" v-model="review.status" @change="updateStatus">
            <option value="in_review">Aguardando avaliação</option>
            <option value="approved">Aprovado</option>
            <option value="rejected">Rejeitado</option>
          </select>
        </div>
        <div class="p-3 mt-5">
          <h1 class="font-bold">Feed de atividades</h1>
          <span class="mt-5 block">2 de nov. de 2024</span>
          <p class="max-w-[180px]">Caio Teca avaliou à empresa de Sonangol</p>
          <div class="relative flex flex-col gap-5 w-full my-5">
            <input type="text" placeholder="Escreva um comentário" class="p-10 rounded-lg border">
            <button class="border text-[#2D2D2D] rounded-lg p-2 w-full hover:bg-[#003F72] hover:text-white">Salvar o comentário</button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>

</style>