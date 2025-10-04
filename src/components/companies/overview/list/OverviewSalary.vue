<script setup lang="ts">
import Carousel from "@/components/carousel/Carousel.vue";
import { useRoute } from "vue-router";
import {computed, onMounted, reactive, ref} from "vue";
import type {Position} from "@/types/Position";
import ItemCompanySalarySkeleton from "@/components/skeleton/ItemCompanySalarySkeleton.vue";
import {useAreaPositionStore} from "@/stores/areasPosition";
import ItemSalaryOverview from "@/components/companies/overview/list/item/ItemSalaryOverview.vue";
import ItemCarouselSalaryOverview from "@/components/companies/overview/list/item/ItemCarouselSalaryOverview.vue";

const route = useRoute();
const companyId = computed(() => route.params.companyId as string);
const areaPositionStore = useAreaPositionStore();

const data = reactive<{  metadata: Record<string, any>;
  positions: Position[];
}>({ metadata: {}, positions: [],});

const isLoading = ref(false);
const isEmpty = ref(false);

const groupedPositions = computed(() => {
  return data.positions.reduce((acc, job) => {
    if (!acc[job.area]) {
      acc[job.area] = [];
    }
    acc[job.area].push(job);
    return acc;
  }, {} as Record<string, Position[]>);
});

onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await areaPositionStore.getAll({
      filter: { companyId: companyId.value }, page: 1, limit: 9,
    });
    if(response.data){ Object.assign(data, response.data);}
    else{ isEmpty.value = true;}
  } catch (error) {
    console.error("Erro ao buscar dados das áreas:", error);
  }finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <h2 class="text-[#2D2D2D] text-xl sm:text-2xl font-bold dark:text-white">Salários</h2>
  <div class="">
    <div class="" v-if="isLoading && !isEmpty">
      <h1 class="max-w-32 my-4 h-4 bg-gray-200 rounded"></h1>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <ItemCompanySalarySkeleton v-for="i in 3"></ItemCompanySalarySkeleton>
      </div>
    </div>
    <div v-else-if="!isLoading && isEmpty">
      <div class="py-10">
        <div class="flex items-center justify-center dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign h-12 w-12 text-muted-foreground mx-auto mb-4" data-lov-id="src/pages/CompanyDetailPage.tsx:232:20" data-lov-name="DollarSign" data-component-path="src/pages/CompanyDetailPage.tsx" data-component-line="232" data-component-file="CompanyDetailPage.tsx" data-component-name="DollarSign" data-component-content="%7B%22className%22%3A%22h-12%20w-12%20text-muted-foreground%20mx-auto%20mb-4%22%7D"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <div class="flex flex-col justify-center items-center gap-1 dark:text-white">
          <h1 class="font-bold text-xl text-center dark:text-white">Esta empresa ainda não foi avaliada</h1>
          <p class="text-md text-gray-500 text-center dark:text-gray-300">Seja o primeiro avaliar o salario na empresa, clique para
            <a :href="`/company/${companyId}/review`" class="text-[#003F72] underline text-md text-blue-500">avaliar</a>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="">
      <div class="hidden md:block">
        <p class="text-[#424242] my-5 max-w-[95%] dark:text-white">Salário estimado com base em funcionários (antigos ou atuais).</p>
        <div v-for="(positions,area) in groupedPositions" :key="area" class="mb-6">
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div>
              <h2 class="text-lg font-bold text-[#003F72] dark:text-white">{{ area }}</h2>
              <div v-for="position in positions" :key="position.id" class="">
                <ItemSalaryOverview :position="position" :key="position.id"></ItemSalaryOverview>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Carousel class="block md:hidden" :items="data.positions">
        <template v-for="(item, index) in data.positions" :key="index" #[`slide-${index}`]="{ item }">
          <div class="bg-white dark:bg-gray-900">
            <h2 class="text-lg font-bold text-[#003F72] dark:text-white">{{ item.area }}</h2>
            <div class="">
              <ItemCarouselSalaryOverview :position="item" :key="item.id"></ItemCarouselSalaryOverview>
            </div>
          </div>
        </template>
      </Carousel>
      <div class="my-6">
        <a class="flex items-center mt-4 text-[#003F72] font-bold dark:text-blue-500" :href="`/salaries/company/${companyId}`">
          Pesquisar mais salários
          <i class="bx bx-chevron-right text-2xl text-black mt-1 dark:text-white"></i>
        </a>
      </div>
    </div>
  </div>
</template>