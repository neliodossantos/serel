<script setup lang="ts">
import ProgressCircle from "@/components/ui/progress/ProgressCircle.vue";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useUserStore} from "@/stores/users";
import {useCompanyStore} from "@/stores/companies";
import type {Company} from "@/types/Company";
import {useAreaPositionStore} from "@/stores/areasPosition";
import type {Position} from "@/types/Position";
import ItemCompanySalarySkeleton from "@/components/skeleton/ItemCompanySalarySkeleton.vue";
import {formatNumberInFull, formatSalary} from "@/utils/formatCurrency";
import ItemSalaryOverview from "@/components/companies/overview/list/item/ItemSalaryOverview.vue";

const props = defineProps<{
  currentCompany: Company;
  searchQuery?: {
    role: string;
    place: string;
  };
}>();

const areaPositionStore = useAreaPositionStore();
const route = useRoute();
const router = useRouter();
const search = ref((route.query.q || "") as string);
const totalItems = ref(0);
const totalItemsLoaded = ref(0);
const itemsPerPage = ref(9);
const data = reactive<{  metadata: Record<string, any>;
  positions: Position[];
}>({ metadata: {}, positions: [],});
const isLoading = ref(false);
const isEmpty = ref(false);
const currentPage = ref(Number(route.query.page) || 1);
const loadedPages = ref([currentPage.value]);
const lastPage = ref(false);

// Cálculo da porcentagem de satisfação salarial
const satisfactionPercentage = computed(() => {
  if (!props.currentCompany.rating?.salary?.reviewCount || props.currentCompany.rating.salary.reviewCount === 0) {
    return 0;
  }
  return Math.round((props.currentCompany.rating.salary.satisfiedCount / props.currentCompany.rating.salary.reviewCount) * 100);
});

const salarySatisfactionMessage = computed(() => {
    const salaryRating = props.currentCompany.rating?.salary;
    //Caso não haja avaliações
    if (!salaryRating?.reviewCount) {
        return "No momento, ninguém avaliou a satisfação salarial na empresa " + props.currentCompany.name + ".";
    }
    const satisfactionPercentage = Math.round(
        (salaryRating.satisfiedCount / salaryRating.reviewCount) * 100
    );
    // Faixas de satisfação
    if (satisfactionPercentage === 0) {
        return "No momento, ninguém está satisfeito com o salário na empresa " + props.currentCompany.name + ".";
    }
    if (satisfactionPercentage < 15) {
        return "Apenas uma pequena parte está satisfeita com o salário na empresa " + props.currentCompany.name + ".";
    }
    if (satisfactionPercentage < 50) {
        return "Menos da metade está satisfeita com o salário na empresa " + props.currentCompany.name + ".";
    }
    if (satisfactionPercentage < 75) {
        return "A maioria está satisfeita com o salário na empresa " + props.currentCompany.name + ",mas ainda há insatisfeitos.";
    }
    if (satisfactionPercentage < 100) {
        return "Grande parte está satisfeita com o salário na empresa " + props.currentCompany.name + ",com poucos insatisfeitos.";
    }
    return "Todos estão satisfeitos com o salário o salário na empresa " + props.currentCompany.name;
});



const groupedPositions = computed(() => {
  return data.positions.reduce((acc, job) => {
    if (!acc[job.area]) {
      acc[job.area] = [];
    }
    acc[job.area].push(job);
    return acc;
  }, {} as Record<string, Position[]>);
});

async function fetchCompanies(page: number) {
  try {
    isLoading.value = true;
    isEmpty.value = false;

    if (page === 1) {
      totalItemsLoaded.value = 0;
      data.positions = [];
    }
    const filter = {
      companyId: props.currentCompany.id,
      ...(props.searchQuery?.role && { title: props.searchQuery.role }),
      ...(props.searchQuery?.place && { location: props.searchQuery.place })
    };

    const response = await areaPositionStore.getAll({filter, page, limit: itemsPerPage.value });
    if (response.data !== null) {
      Object.assign(data, response.data);
      totalItems.value = response.data.metadata.total;
      totalItemsLoaded.value += response.data.positions.length;
      lastPage.value = page === Math.ceil(totalItems.value / itemsPerPage.value);
      if (!loadedPages.value.includes(page)) {
        loadedPages.value.push(page);
        loadedPages.value.sort((a, b) => a - b);
      }
    } else {
      isEmpty.value = true;
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  } finally {
    isLoading.value = false;
  }
}

const loadPage = async (page: number) => {
  scrollTo(0,0);
  const totalPages = Math.ceil(totalItems.value / itemsPerPage.value);
  if (page < 1 || page > totalPages || page === currentPage.value) return;
  currentPage.value = page;
  await router.push({ query: { ...route.query, page: String(page) } });
  await fetchCompanies(page);
};

watch(() => props.searchQuery, async (newQuery) => {
  if (newQuery) {
    currentPage.value = 1;
    await router.push({
      query: { ...route.query, page: "1", q: newQuery.role}});
    await fetchCompanies(1);
  }
}, { deep: true });

onMounted(async () => {
  await fetchCompanies(currentPage.value);
});
</script>
<template>
  <div class="px-[12%] mt-16">
    <h2 class="text-xl font-bold dark:text-white">Salário na empresa {{currentCompany.name}}</h2>
        <div class="mb-6 mt-3 flex flex-wrap lg:flex-nowrap gap-8">
          <div class="flex-[75%] mb-6">
            <div v-if="isLoading && !isEmpty"  class="">
              <h1 class="max-w-32 my-4 h-4 bg-gray-200 rounded"></h1>
              <div class="grid grid-cols-2 gap-10">
                <ItemCompanySalarySkeleton v-for="i in 3"></ItemCompanySalarySkeleton>
              </div>
            </div>
            <div v-else-if="!isLoading && isEmpty" class="py-10">
              <div class="py-10">
                <div class="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign h-12 w-12 text-muted-foreground mx-auto mb-4 dark:text-white" data-lov-id="src/pages/CompanyDetailPage.tsx:232:20" data-lov-name="DollarSign" data-component-path="src/pages/CompanyDetailPage.tsx" data-component-line="232" data-component-file="CompanyDetailPage.tsx" data-component-name="DollarSign" data-component-content="%7B%22className%22%3A%22h-12%20w-12%20text-muted-foreground%20mx-auto%20mb-4%22%7D"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div class="flex flex-col justify-center items-center gap-1">
                  <h1 class="font-bold text-xl text-center dark:text-white">Esta empresa ainda não foi avaliada</h1>
                  <p class="text-md text-gray-500 text-center dark:text-gray-300">Seja o primeiro avaliar o salario na empresa, clique para
                    <a :href="`/company/${currentCompany.id}/salary`" class="text-[#003F72] underline text-md dark:text-blue-500">avaliar</a>
                  </p>
                </div>
              </div>
            </div>
            <div v-else v-for="(positions,area) in groupedPositions" :key="area" class="mb-6">
              <div class="">
                <div class="grid md:grid-cols-2 gap-10">
                  <div class="">
                    <h2 class="text-lg font-bold text-[#003F72]">{{ area }}</h2>
                    <div v-for="position in positions" :key="position.id" class="">
                      <ItemSalaryOverview :position="position" :key="position.id"></ItemSalaryOverview>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="!isLoading && !isEmpty" class="flex gap-3 items-center justify-center my-10 py-5">
                <button @click="loadPage(currentPage - 1)" :disabled="currentPage === 1 || isLoading" class="border-none bg-[#F3F2F1] px-3 py-2 sm:px-4 sm:py-2 rounded text-[#003F72]">
                  <span class="hidden sm:inline-block">Anterior</span>
                  <i class='inline-block sm:hidden bx bx-chevrons-left'></i>
                </button>
                <button @click="loadPage(page)" v-for="page in loadedPages"
                        :key="page" :class="currentPage === page ? 'bg-[#003F72] text-white' : 'bg-[#F3F2F1] text-black'" class="border-none px-3 py-2 sm:px-4 sm:py-2 rounded ">
                  {{ page }}
                </button>
                <button @click="loadPage(currentPage + 1)" :disabled="lastPage || isLoading" class="border-none bg-[#F3F2F1] px-3 py-2 sm:px-4 sm:py-2 rounded text-[#003F72]">
                  <span class="hidden sm:inline-block">Próximo</span>
                  <i class='inline-block sm:hidden bx bx-chevrons-right'></i>
                </button>
              </div>
            </div>
          </div>
          <div class="flex-[25%] border border-[#D4D2D0] rounded col-span-1 p-8 md:mt-10 max-h-[350px]">
            <h2 class="font-bold text-base sm:text-lg mb-5 dark:text-white">Satisfação salarial</h2>
            <ProgressCircle :progress="satisfactionPercentage"></ProgressCircle>
            <p class="text-[#595959] dark:text-gray-300 my-3 text-sm">
               {{ salarySatisfactionMessage }} 
              <span v-if="currentCompany.rating?.salary?.reviewCount"> com base em {{ currentCompany.rating.salary.reviewCount }} avaliações.</span>
              <span v-else>Ainda não há avaliações suficientes.</span>
            </p>
            <a class="text-[#003F72] dark:text-blue-500" :href="`/company/${currentCompany.id}/salary`">Adicione sua classificação</a>
          </div>
    </div>
  </div>
</template>
<style scoped>
</style>