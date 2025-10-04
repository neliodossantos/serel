<script setup lang="ts">
import Carousel from "@/components/carousel/Carousel.vue";
import {onMounted, ref} from "vue";
import { useRoute } from "vue-router";
import { useReviewStore } from "@/stores/reviews";
import type {Review} from "@/types/Review";
import type {Company} from "@/types/Company";
import ItemOverviewReviews from "@/components/companies/overview/list/item/ItemOverviewReviews.vue";
import ItemCarouselOverviewReviews from "@/components/companies/overview/list/item/ItemCarouselOverviewReviews.vue";
import NoDataComponent from "@/components/NoDataComponent.vue";
const route = useRoute();
const companyId = route.params.companyId;

const props = defineProps<{ currentCompany: Company;}>();
const isLoading = ref(false);
const reviewStore = useReviewStore();
const reviews = ref<Review[]>([]);
const isEmpty = ref(false);

onMounted(async () =>{
  try {
    isLoading.value = true;
    const query = { filter: { companyId : props.currentCompany.id , status: "published" }, page: 1, limit : 3 };
    const response = await reviewStore.getAll(query);
    if(response.data){
      reviews.value = response.data.reviews;
    }else{
      isEmpty.value = true;
    }
  }catch (e) {
    console.log(e);
  }finally {
    isLoading.value = false;
  }
});

</script>
<template>
  <div v-if="!isLoading && !isEmpty" class="mt-5 md:mt-10 ">
    <ItemOverviewReviews v-for="review in reviews" :key="review.id" :review="review"></ItemOverviewReviews>
    <ItemCarouselOverviewReviews :reviews="reviews"></ItemCarouselOverviewReviews>
    <div class="my-6">
      <a class="flex items-center mt-4 text-[#003F72] font-bold text-blue-500" :href="`/reviews/company/${companyId}`">Ver todas as avaliações
        <i class='bx bx-chevron-right text-2xl text-black dark:text-white'></i>
      </a>
    </div>
  </div>
  <div class="mt-5" v-else-if="!isLoading && isEmpty">
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
        <p class="text-md text-gray-500 text-center dark:text-gray-200">Seja o primeiro avaliar a empresa, clique para
          <a :href="`/company/${companyId}/review`" class="text-[#003F72] underline text-md dark:text-blue-500">avaliar</a>
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>