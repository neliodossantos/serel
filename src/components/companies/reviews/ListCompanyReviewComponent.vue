<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import type { Company } from "@/types/Company";
import { useReviewStore } from "@/stores/reviews";
import type { Review } from "@/types/Review";
import ItemCompanyReviewComponent from "@/components/companies/reviews/ItemCompanyReviewComponent.vue";
import ItemCompanyReviewSkeleton from "@/components/skeleton/ItemCompanyReviewSkeleton.vue";

const route = useRoute();
const companyId = route.params.companyId;
defineProps<{ currentCompany: Company }>();

const isLoading = ref(false);
const reviewStore = useReviewStore();
const reviews = ref<Review[]>([]);
const isEmpty = ref(false);
const totalItems = ref(0);
const itemsPerPage = ref(3);
const currentPage = ref(1);
const loadedPages = ref<number[]>([]);
const lastPage = ref(false);

async function fetchCompanies(page: number) {
  try {
    isLoading.value = true;
    if (page === 1) {
      reviews.value = [];
    }
    const response: any = await reviewStore.getAll({
      filter: { companyId: companyId , status: "published" },
      page,
      limit: itemsPerPage.value,
    });
    if (response.data) {
      reviews.value = response.data.reviews;
      totalItems.value = response.data.metadata.total;
    } else {
      isEmpty.value = true;
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  } finally {
    isLoading.value = false;
  }
}

const updatePages = (page: number) => {
  if(page > 1){
    if (window.innerWidth <= 1024) {
      scrollTo(0, 800);
    } else {
      scrollTo(0, 0);
    }
  }
  const totalPages = Math.ceil(totalItems.value / itemsPerPage.value);
  const maxPagesToShow = 4;
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (page < maxPagesToShow) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else {
      startPage = page;
      endPage = page + maxPagesToShow - 1;
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxPagesToShow + 1;
      }
    }
  }

  loadedPages.value = [];
  for (let i = startPage; i <= endPage; i++) {
    loadedPages.value.push(i);
  }
  lastPage.value = page === totalPages;
};

const loadPage = async (page: number) => {
  const totalPages = Math.ceil(totalItems.value / itemsPerPage.value);
  if (page < 1 || page > totalPages || page === currentPage.value) return;
  currentPage.value = page;
  updatePages(page);
  await fetchCompanies(page);
};

onMounted(async () => {
  await fetchCompanies(currentPage.value);
  updatePages(currentPage.value);
});
</script>

<template>
  <div class="mb-3 flex flex-col md:flex-row md:items-center md:justify-between">
    <h1 class="dark:text-gray-300">Empresa {{ currentCompany.name }}: {{ totalItems }} {{totalItems > 1 ? 'avaliações' : 'avaliação'}}</h1>
    <div class="xl:hidden flex-1 md:flex-none block mt-3">
      <a :href="`/company/${currentCompany.id}/review`"
          class="w-full block py-[12px] lg:py-[16px] text-center px-10 lg:px-[60px] rounded text-[#003F72] font-bold border border-[#C3C6E5] dark:text-blue-500">
        Avaliar empresa
      </a>
    </div>
  </div>
  <ItemCompanyReviewSkeleton v-if="isLoading" v-for="i in itemsPerPage" :key="i"/>
  <div class="col-span-3 py-10" v-else-if="!isLoading && isEmpty">
    <div class="py-10">
      <div class="flex mb-3 items-center justify-center">
          <svg class="dark:text-white" fill="currentColor" height="60" width="60" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
               viewBox="0 0 32 32" xml:space="preserve">
          <path d="M27,5H5C3.3,5,2,6.3,2,8v14c0,1.7,1.3,3,3,3h16.4l7,5.8c0.2,0.2,0.4,0.2,0.6,0.2c0.1,0,0.3,0,0.4-0.1
            c0.4-0.2,0.6-0.5,0.6-0.9V8C30,6.3,28.7,5,27,5z M17.7,14.3l-2.1,2.1l0.5,2.9c0.1,0.4-0.1,0.8-0.4,1c-0.2,0.1-0.4,0.2-0.6,0.2
            c-0.2,0-0.3,0-0.5-0.1L12,18.9l-2.6,1.4c-0.3,0.2-0.7,0.2-1.1-0.1c-0.3-0.2-0.5-0.6-0.4-1l0.5-2.9l-2.1-2.1C6,14,5.9,13.6,6,13.3
            c0.1-0.4,0.4-0.6,0.8-0.7l2.9-0.4l1.3-2.7c0.3-0.7,1.5-0.7,1.8,0l1.3,2.7l2.9,0.4c0.4,0.1,0.7,0.3,0.8,0.7
            C18.1,13.6,18,14,17.7,14.3z M25,18h-3c-0.6,0-1-0.4-1-1s0.4-1,1-1h3c0.6,0,1,0.4,1,1S25.6,18,25,18z M25,14h-5c-0.6,0-1-0.4-1-1
            s0.4-1,1-1h5c0.6,0,1,0.4,1,1S25.6,14,25,14z"/>
          </svg>
        </div>
        <div class="flex flex-col justify-center items-center gap-1">
          <h1 class="font-bold text-xl text-center dark:text-white">Esta empresa ainda não foi avaliada</h1>
          <p class="text-md text-gray-500 text-center dark:text-gray-300">Seja o primeiro avaliar a empresa, clique para
            <a :href="`/company/${companyId}/review`" class="text-[#003F72] underline text-md dark:text-blue-500">avaliar</a>
          </p>
        </div>
      </div>
    </div>
  <ItemCompanyReviewComponent v-else v-for="review in reviews" :review="review"
      :currentCompany="currentCompany" :key="review.id"/>
  <div v-if="!isLoading && !isEmpty" class="flex gap-3 items-center justify-center my-10 py-5">
    <button @click="loadPage(currentPage - 1)" :disabled="currentPage === 1 || isLoading"
        class="cursor-pointer border-none bg-[#F3F2F1] px-3 py-2 sm:px-4 sm:py-2 rounded text-[#003F72]">
      <span class="hidden sm:inline-block">Anterior</span>
      <i class="inline-block sm:hidden bx bx-chevrons-left"></i>
    </button>
    <button v-for="page in loadedPages" :key="page" @click="loadPage(page)" :class="currentPage === page ? 'bg-[#003F72] text-white' : 'bg-[#F3F2F1] text-black'"
        class="cursor-pointer border-none px-3 py-2 sm:px-4 sm:py-2 rounded">{{ page }}</button>
    <button @click="loadPage(currentPage + 1)"
        :disabled="lastPage || isLoading" class="cursor-pointer border-none bg-[#F3F2F1] px-3 py-2 sm:px-4 sm:py-2 rounded text-[#003F72]">
      <span class="hidden sm:inline-block">Próximo</span>
      <i class="inline-block sm:hidden bx bx-chevrons-right"></i>
    </button>
  </div>
</template>
<style scoped></style>