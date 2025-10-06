<script setup lang="ts">
import MainLayout from "@/layout/MainLayout.vue";
import {useRoute} from "vue-router";
import {onMounted, reactive, ref, computed} from "vue";
import {useReviewStore} from "@/stores/reviews";
import ItemReviewDetailsComponent from "@/components/companies/overview/list/item/ItemReviewDetailsComponent.vue";
import type {Review} from "@/types/Review";
import router from "@/router";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import FormCompanyReviewComponent from "@/components/companies/reviews/FormCompanyReviewComponent.vue";
import {useCompanyStore} from "@/stores/companies";
import type {Company} from "@/types/Company";
import {useUserStore} from "@/stores/users";
import ErrorReconnectComponent from "@/components/ErrorReconnectComponent.vue";
import { useHead } from '@vueuse/head';

const route = useRoute();
const reviewId = route.params.reviewId;
const company = reactive<Partial<Company>>({});
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref('Não foi possível carregar os detalhes da avaliação.');
const errorCode = ref(0);
const reviewStore = useReviewStore();
const companyStore = useCompanyStore();
const review = reactive<Partial<Review>>({});
const userStore = useUserStore();

// Dynamic meta tags for SEO and social sharing
const metaTitle = computed(() => {
  if (review.reviewTitle && company.name) {
    return `${review.reviewTitle} - Avaliação da empresa - ${company.name}`;
  }
  return 'Avaliação de Empresa - Serel';
});

const metaDescription = computed(() => {
  if (review.comment?.comment) {
    return review.comment.comment.length > 160
      ? review.comment.comment.substring(0, 160) + '...'
      : review.comment.comment;
  }
  if (review.score && company.name) {
    return `Avaliação da empresa ${company.name} com ${review.score} estrelas. Leia a opinião completa.`;
  }
  return 'Leia avaliações reais de empresas e salários. Descubra experiências de funcionários.';
});

const metaImage = computed(() => {
  return company.logo || `${window.location.origin}/logo_alternativo_serel.png`;
});

const metaUrl = computed(() => window.location.href);

useHead({
  title: metaTitle,
  meta: [
    { name: 'description', content: metaDescription },
    // Open Graph
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:image', content: metaImage },
    { property: 'og:url', content: metaUrl },
    { property: 'og:type', content: 'article' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metaTitle },
    { name: 'twitter:description', content: metaDescription },
    { name: 'twitter:image', content: metaImage },
  ],
});


const backToPage = () => {
  if(window.history.length > 1){
    router.back();
  }
}

onMounted(async () => {
  try {
    isLoading.value = true;
    hasError.value = false;

    if (!navigator.onLine) {
      hasError.value = true;
      errorMessage.value = 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
      return;
    }

    const responseReview: any = await reviewStore.getOne({
      filter: { id: reviewId },
      page: 1,
      limit: 1,
    });

    if (!responseReview || !responseReview.data) {
      hasError.value = true;
      errorMessage.value = 'Não foi possível carregar os detalhes da avaliação.';
      return;
    }

    Object.assign(review, responseReview.data);

    if (review.companyId) {
      try {
        const responseCompany: any = await companyStore.getOne({
          filter: { id: review.companyId },
          page: 1,
          limit: 1,
        });

        if (responseCompany && responseCompany.data) {
          Object.assign(company, responseCompany.data);
        }
      } catch (companyError) {
        console.error("Erro ao buscar dados da empresa:", companyError);
        // Não consideramos erro fatal se apenas os dados da empresa falharem
      }
    }
  } catch (error: any) {
    console.error("Erro ao buscar dados:", error);
    hasError.value = true;
    errorCode.value = error?.response?.status || 0;
    errorMessage.value = error?.response?.data?.message || 'Ocorreu um erro ao carregar os detalhes da avaliação.';
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <ErrorReconnectComponent 
    v-if="hasError" 
    :message="errorMessage"
    :error-code="errorCode"
    reload-button-text="Recarregar página"
  />
  <PreloaderComponent v-else-if="isLoading"></PreloaderComponent>
  <MainLayout v-else>
    <div class="w-full bg-[#F8FAFB] dark:bg-[#000e1c] min-h-[210px] mb-24 flex justify-center border-b border-[#D4D2D0] px-[12%]"></div>
    <div class="w-full mb-24 px-[12%] md:px-0">
      <div class="mx-auto relative  max-w-[400px] sm:max-w-[600px] md:max-w-[900px]">
        <a v-if="userStore.isLogged()" @click="backToPage" class="cursor-pointer flex items-center dark:text-white">
          <i class='bx bx-chevron-left text-3xl md:text-2xl'></i>
          Voltar a página anterior
        </a>
        <a v-else href="/" class="cursor-pointer flex items-center dark:text-white">
          <i class='bx bx-chevron-left text-3xl md:text-2xl'></i>
          Voltar a página inicial
        </a>
        <a class="left-30 w-full h-[150px] block -top-[11rem] md:-top-44 absolute cursor-pointer" :href="`/overview/company/${company.id}`">
          <img class="max-w-[150px] min-h-full mx-auto object-cover rounded block" :src="company.logo" :alt="`Logo da empresa ${company.name}`">
        </a>
        <div class="flex justify-center md:mt-10 min-h-auto">
          <ItemReviewDetailsComponent :review="review as Review" :currentCompany="company"></ItemReviewDetailsComponent>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
<style scoped>
</style>