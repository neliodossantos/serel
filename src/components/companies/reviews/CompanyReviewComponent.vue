<script setup lang="ts">
import { Progress } from "@/components/ui/progress";
import ListCompanyValuation from "@/components/companies/reviews/ListCompanyReviewComponent.vue";
import type { Company } from "@/types/Company";
import { onMounted, reactive, ref, computed } from "vue";
import { useReviewStore } from "@/stores/reviews";

const props = defineProps<{ currentCompany: Company }>();
const ratings = reactive<Record<string, number>>({});
const reviewStore = useReviewStore();

const hoverRating = ref(0);
const selectedRating = ref(0);

const completeRecords = computed(() => {
  const newRatings: Record<number, number> = {};
  for (let i = 1; i <= 5; i++) {
    newRatings[i] = ratings[i.toString()] || 0;
  }
  return newRatings;
});

const totalReviews = computed(() => {
  return Object.values(completeRecords.value).reduce((sum, count) => sum + count, 0);
});

function getProgressValue(star: number): number {
  if (totalReviews.value === 0) return 0;
  return (completeRecords.value[star] / totalReviews.value) * 100;
}

const filledStars = (rating: number) => Math.floor(rating ?? 0);
const hasHalfStar = (rating: number) => (rating ?? 0) % 1 >= 0.5;
const emptyStars = (rating: number) => {
  const hadHalfStar = hasHalfStar(rating);
  const fillStars = filledStars(rating);
  return 5 - fillStars - (hadHalfStar ? 1 : 0);
};


function handleStarReview(star: number) {
  selectedRating.value = star;
  localStorage.setItem('star', JSON.stringify(selectedRating.value));
  window.location.href = `/company/${props.currentCompany.id}/review`;
}
onMounted(async () => {
  try {
    const response = await reviewStore.getRatingByCompanyId({
      filter: { companyId: props.currentCompany.id , status : "published" },
      groupBy: "score"
    });
    if(response.data?.records){
      Object.assign(ratings,response.data.records);
    }
  } catch (e) {
    console.error(e);
  }
});
</script>
<template>
  <div class="px-[12%] mt-4 md:mb-32">
    <div class="grid xl:grid-cols-3 py-3 lg:gap-28 gap-12 md:mt-16">
      <div class="col-span-3 lg:col-span-2">
        <div class="">
          <div class="rounded-md mb-10 xl:my-0 border-2 border-[#C3C6E5] p-3 xl:hidden block">
            <h3 class="font-bold text-xl my-2 dark:text-white">Classificação geral</h3>
            <div class="h-full">
              <div class="flex items-center gap-3">
                <span class="text-2xl font-bold dark:text-white">{{ currentCompany.rating?.average }}</span>
                <div class="flex gap-2 items-center">
                  <i v-for="n in filledStars(currentCompany.rating?.average ?? 0)" :key="'filled-' + n" class="bx bxs-star text-xl sm:text-2xl text-[#003F72]"></i>
                  <i v-if="hasHalfStar(currentCompany.rating?.average ?? 0)" class="bx bxs-star-half text-[#003F72] text-xl sm:text-2xl"></i>
                  <i v-for="n in emptyStars(currentCompany.rating?.average ?? 0)" :key="'empty-' + n" class="bx bx-star text-xl sm:text-2xl text-[#003F72]"></i>
                </div>
              </div>
              <span class="text-sm text-[#595959] dark:text-white">Com base em {{ currentCompany.rating?.numberOfReviews }} avaliações</span>
            </div>
            <div class="">
              <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-stretch mb-4">
                <div class="flex items-center gap-1">
                  <span class="text-[#595959] md:text-md dark:text-white">{{ star }}</span>
                  <i class="bx bxs-star md:text-md text-[#003F72]"></i>
                </div>
                <Progress class="mt-[0.5rem] ml-2" :model-value="getProgressValue(star)" />
              </div>
            </div>
          </div>
          <ListCompanyValuation :current-company="currentCompany" />
        </div>
        <div class="mt-10 bg-[#F3F2F1] rounded-lg flex items-center justify-center">
          <div class="p-10 md:p-14 text-center">
            <h1 class="sm:text-xl text-lg font-bold my-2">Avalie sua empresa recente</h1>
            <p class="text-[#595959]">Compartilhe sua experiência para ajudar outras pessoas</p>
            <div class="my-3 flex mx-auto max-w-[230px] gap-2 justify-center bg-white rounded-md shadow py-3">
              <button v-for="i in 5" :key="i"
                  class=""
                  @mouseover="hoverRating = i" @mouseleave="hoverRating = selectedRating"
                  @click="handleStarReview(i)">
                <i :class="['bx', i <= hoverRating ? 'bxs-star text-[#003F72]' : 'bx-star text-[#003F72]', 'text-2xl md:text-3xl']"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-10 xl:pl-10">
        <div class="w-full hidden xl:block">
          <a :href="`/company/${currentCompany.id}/review`" class="w-full block text-center py-[12px] lg:py-[18px] lg:px-[40px] rounded text-[#003F72] font-bold border-2 border-[#C3C6E5] dark:text-blue-500">Avaliar empresa</a>
        </div>
        <div class="rounded-md border-2 border-[#C3C6E5] p-8 xl:block hidden">
          <h3 class="font-bold dark:text-white">Classificação geral</h3>
          <div>
            <div class="flex items-center gap-3">
              <span class="text-2xl font-bold dark:text-white">{{ currentCompany.rating?.average }}</span>
              <div class="flex gap-2 items-center">
                <i v-for="n in filledStars(currentCompany.rating?.average ?? 0)" :key="'filled-' + n" class="bx bxs-star text-xl sm:text-2xl text-[#003F72]"></i>
                <i v-if="hasHalfStar(currentCompany.rating?.average ?? 0)" class="bx bxs-star-half text-[#003F72] text-xl sm:text-2xl"></i>
                <i v-for="n in emptyStars(currentCompany.rating?.average ?? 0)" :key="'empty-' + n" class="bx bx-star text-xl sm:text-2xl text-[#003F72]"></i>
              </div>
            </div>
            <span class="text-sm text-[#595959] dark:text-white">Com base em {{ currentCompany.rating?.numberOfReviews }} avaliações</span>
          </div>
          <div class="xl:block hidden">
            <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="flex items-stretch mb-4">
              <div class="flex items-center gap-1">
                <span class="text-[#595959] md:text-md dark:text-white">{{ star }}</span>
                <i class="bx bxs-star md:text-md text-[#003F72]"></i>
              </div>
              <Progress class="mt-[0.5rem] ml-2" :model-value="getProgressValue(star)" />
            </div>
          </div>
        </div>
        <div class="rounded-md xl:block hidden border-2 border-[#C3C6E5] p-8 dark:text-white">
            <h3 class="mb-1">Quer saber mais sobre como trabalhar na <span class="font-bold">empresa {{currentCompany.name}}</span>?</h3>
          <p>Faça uma pergunta. Nossa comunidade está pronta para responder.</p>
          <button class="px-4 py-3 my-5 w-full text-[#003F72] font-bold shadow rounded-lg border border-[#C3C6E5] dark:text-blue-500">Faça uma pergunta</button>
        </div>
        <div class="rounded-md border-2 border-[#C3C6E5] p-8 hidden">
          <h3 class="font-bold text-[#2D2D2D]">Dúvidas sobre a empresa {{currentCompany.name}}</h3>
          <div class="my-2">
            <h3 class="text-[#767676]">Que perguntas eles fizeram durante sua entrevista na Unimed?</h3>
            <span class="text-[#767676]">2 pessoas responderam</span>
          </div>
          <div class="my-2">
            <h3 class="text-[#767676]">Que perguntas eles fizeram durante sua entrevista na Unimed?</h3>
            <span class="text-[#767676]">2 pessoas responderam</span>
          </div>
          <div class="my-2">
            <h3 class="text-[#767676]">Que perguntas eles fizeram durante sua entrevista na Unimed?</h3>
            <span class="text-[#767676]">2 pessoas responderam</span>
          </div>
          <a class="underline text-[#003F72] dark:text-blue-500" href="">Mostrar mais</a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
