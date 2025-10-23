<script setup lang="ts">
import { onMounted, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import MainLayout from "@/layout/MainLayout.vue";
import { useUserStore } from "@/stores/users";
import { useCompanyStore } from "@/stores/companies";
import ItemCompanyComponent from "@/components/companies/list/item/ItemCompanyComponent.vue";
import PopularCompanySkeleton from "@/components/skeleton/PopularCompanySkeleton.vue";
import ModalAuth from "@/components/auth/ModalAuth.vue";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import type { Company } from "@/types/Company";
import ErrorReconnectComponent from "@/components/ErrorReconnectComponent.vue";

const route = useRoute();
const router = useRouter();
const search = ref((route.query.q || "") as string);
const groupBy = ref((route.query.groupBy || "") as string);
const isLoading = ref(false);
const totalItems = ref(0);
const itemsPerPage = ref(6);

const userStore = useUserStore();
const companyStore = useCompanyStore();
const showDropdownFilterBy = ref(false);
const showModalUser = ref(false);
const companies = ref<Company[]>([]);
const currentPage = ref(Number(route.query.page) || 1);
const lastPage = ref(false);
const isEmpty = ref(false);
const hasError = ref(false);
const errorMessage = ref('Não foi possível carregar as informações solicitadas.');
const errorCode = ref(0);
const currentFilter = ref("numberOfReviews");

const totalPages = computed(() =>
    Math.ceil(totalItems.value / itemsPerPage.value),
);
const totalLoaded = computed(() => {
    return (
        (currentPage.value - 1) * itemsPerPage.value + companies.value.length
    );
});

// Limita o número de páginas exibidas para 4
const displayedPages = computed(() => {
    const pages = [];
    const maxPagesToShow = 4;
    // Se o total de páginas for menor ou igual ao limite, exibe todas
    if (totalPages.value <= maxPagesToShow) {
        for (let i = 1; i <= totalPages.value; i++) {
            pages.push(i);
        }
    } else {
        // Se a página atual for menor que o limite, inicia sempre do 1
        let startPage =
            currentPage.value < maxPagesToShow ? 1 : currentPage.value;
        let endPage = startPage + maxPagesToShow - 1;
        // Ajusta se o endPage ultrapassar o total de páginas
        if (endPage > totalPages.value) {
            endPage = totalPages.value;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
    }
    return pages;
});

async function selectCurrency(filter: string) {
    if (filter === currentFilter.value) return;
    currentFilter.value = filter;
    showDropdownFilterBy.value = false;
    const newQuery = { ...route.query };
    router.push({ query: { ...newQuery, orderBy: currentFilter.value } });
    await fetchCompanies(1, currentFilter.value);
}

const goToOverviewCompany = (id: string) => {
    if (userStore.isLogged()) {
        showModalUser.value = false;
        window.location.href = "/overview/company/" + id;
    } else {
        showModalUser.value = true;
    }
};

const goToAddCompany = () => {
    if (userStore.isLogged()) {
        showModalUser.value = false;
        router.push({
            path: '/add/company',
            query: { name: search.value }
        });
    } else {
        showModalUser.value = true;
    }
};

async function fetchCompanies(page: number, orderBy = "") {
    try {
        isLoading.value = true;
        isEmpty.value = false;
        hasError.value = false;

        // Verificar se está online
        if (!navigator.onLine) {
            hasError.value = true;
            errorMessage.value = 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
            return;
        }

        const response: any = await companyStore.getAll({
            filter: search.value ? { name: search.value } : {},
            orderBy: groupBy.value ? groupBy.value : orderBy,
            page,
            limit: itemsPerPage.value,
        });

        if (response.data !== null) {
            companies.value = response.data.companies;
            totalItems.value = response.data.metadata.total;
            lastPage.value = page === totalPages.value;
        } else {
            isEmpty.value = true;
            companies.value = [];
        }
    } catch (error: any) {
        console.error("Erro ao buscar dados:", error);
        hasError.value = true;
        errorCode.value = error?.response?.status || 0;
        errorMessage.value = error?.response?.data?.message || 'Ocorreu um erro ao carregar os dados das empresas.';
    } finally {
        isLoading.value = false;
    }
}

const loadPage = async (page: number) => {
    if (page < 1 || page > totalPages.value || page === currentPage.value)
        return;
    currentPage.value = page;
    await router.push({ query: { ...route.query, page: String(page) } });
    await fetchCompanies(page);
    window.scrollTo(0, 0);
};

const handleInput = async () => {
    currentPage.value = 1;
    const newQuery = { ...route.query };
    await router.push({ query: { ...newQuery, q: search.value, page: "1" } });
    await fetchCompanies(1);
};

watch(
    () => route.query.page,
    async (newPage) => {
        const page = Number(newPage) || 1;
        if (page !== currentPage.value) {
            currentPage.value = page;
            await fetchCompanies(page);
        }
    },
);

onMounted(async () => {
    await fetchCompanies(currentPage.value);
});
</script>
<template>
    <ErrorReconnectComponent 
        v-if="hasError" 
        :message="errorMessage"
        :error-code="errorCode"
        reload-button-text="Recarregar página"
    />
    <PreloaderComponent v-else-if="isLoading" />
    <MainLayout v-else>
        <div
            class="w-full md:h-[500px] bg-[#F8FAFB] shadow flex items-center py-10">
            <div class="w-full px-[12%]">
                <div class="flex items-center gap-[64px] justify-between">
                    <div class="flex-1 text-center">
                        <button
                            class="xs:text-sm cursor-default border p-2 mb-3 rounded-lg shadow-sm flex items-center justify-center mx-auto gap-2"
                        >
                            <i
                                class="bx bx-star text-xl 3xl:text-2xl text-[#003F72]"
                            ></i>
                            Avaliações reais de funcionários
                        </button>
                        <h1
                            class="text-3xl mb-2.5 font-bold sm:text-4xl 2xl:text-5xl max-w-[600px] mx-auto text-[#2D2D2D]"
                        >
                            Descubra como é trabalhar nas melhores empresas !
                        </h1>
                        <p
                            class="hidden sm:block text-xl md:text-2xl max-w-[800px] mx-auto"
                        >
                            Avaliações autênticas sobre experiência e salário
                            compartilhadas por funcionários atuais e antigos.
                        </p>
                    </div>
                </div>
                <div class="max-w-[800px] mx-auto">
                    <form @submit.prevent="handleInput" class="mt-5 flex">
                        <div class="relative w-full">
                            <input
                                type="text"
                                v-model="search"
                                required
                                placeholder="Pesquisar..."
                                class="w-full bg-gray-100 text-gray-800 border-2 rounded-lg px-4 py-4 focus:ring-2 focus:ring-[#003F72] focus:outline-none placeholder:text-gray-500"
                            />
                            <button
                                type="submit"
                                class="absolute flex items-center gap-1 right-2 top-1/2 transform -translate-y-1/2 bg-[#003F72] hover:bg-[#002a4d] text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
                            >
                                <i class="bx bx-search text-xl"></i>
                                <span class="md:inline-block hidden"
                                    >Pesquisar</span
                                >
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="mb-10 sm:mb-32 mt-16 px-[12%] w-full">
            <div
                v-if="!isLoading && !isEmpty"
                class="flex items-center justify-between flex-wrap mt-4"
            >
                <span class="md:text-left text-end md:w-auto">
                    {{ totalLoaded }} de {{ totalItems }} empresas
                    encontrados
                </span>
                <div class="flex gap-2 items-center">
                    <span class="block flex-1">Ordenar por:</span>
                    <div class="relative flex-1 min-w-44">
                        <button
                            type="button"
                            @click="
                                showDropdownFilterBy = !showDropdownFilterBy
                            "
                            class="w-full h-full flex items-center justify-between p-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[#003F72] border border-[#D4D2D0]"
                        >
                            <div class="flex items-center gap-2">
                                <span class="inline text-sm md:text-base">{{
                                    currentFilter === "numberOfReviews"
                                        ? "Mais Relevantes"
                                        : currentFilter === "average"
                                          ? "Mais Classificadas"
                                          : ""
                                }}</span>
                            </div>
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        <ul
                            v-if="showDropdownFilterBy"
                            class="absolute left-0 z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg"
                        >
                            <li
                                @click="selectCurrency('numberOfReviews')"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:rounded-lg cursor-pointer"
                            >
                                <span class="text-sm md:text-base"
                                    >Mais Relevantes</span
                                >
                            </li>
                            <li
                                @click="selectCurrency('average')"
                                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:rounded-lg cursor-pointer"
                            >
                                <span class="text-sm md:text-base"
                                    >Mais Classificadas</span
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div
                class="grid mt-10 gap-y-16 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-stretch gap-x-10"
            >
                <PopularCompanySkeleton
                    v-if="isLoading && !isEmpty"
                    v-for="i in 3"
                    :key="i"
                />
                <div 
                    v-else-if="!isLoading && isEmpty" 
                    class="col-span-3 flex flex-col items-center justify-center p-8"
                >
                    <div class="mb-6 text-center">
                        <div class="bg-gray-100 inline-flex rounded-full p-4 mb-4">
                            <i class="bx bx-building text-5xl text-[#003F72]"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">Não encontrou a empresa?</h3>
                        <p class="text-gray-600 max-w-md">
                            Você pode adicionar a empresa {{ search }} à nossa base de dados.
                        </p>
                    </div>
                    <button 
                        @click="goToAddCompany" 
                        class="flex items-center gap-2 bg-[#003F72] hover:bg-[#002a4d] text-white font-medium py-3 px-6 rounded-lg transition-colors">
                        <i class="bx bx-plus-circle text-xl"></i>
                        <span>Adicionar empresa</span>
                    </button>
                </div>
                <ItemCompanyComponent
                    v-else
                    v-for="company in companies"
                    :key="company.id"
                    :company="company"
                    @goToOverviewCompany="goToOverviewCompany"
                />
            </div>
            <div
                v-if="!isLoading && !isEmpty"
                class="flex gap-3 items-center justify-center my-10 py-5"
            >
                <button
                    @click="loadPage(currentPage - 1)"
                    :disabled="currentPage === 1 || isLoading"
                    class="border-none bg-[#F3F2F1] px-3 py-2 sm:px-4 sm:py-2 rounded text-[#003F72]"
                >
                    <span class="hidden sm:inline-block">Anterior</span>
                    <i class="inline-block sm:hidden bx bx-chevrons-left"></i>
                </button>
                <button
                    v-for="page in displayedPages"
                    :key="page"
                    @click="loadPage(page)"
                    :class="
                        currentPage === page
                            ? 'bg-[#003F72] text-white'
                            : 'bg-[#F3F2F1] text-black'
                    "
                    class="border-none px-3 py-2 sm:px-4 sm:py-2 rounded"
                >
                    {{ page }}
                </button>
                <button
                    @click="loadPage(currentPage + 1)"
                    :disabled="currentPage === totalPages || isLoading"
                    class="border-none bg-[#F3F2F1] px-3 py-2 sm:px-4 sm:py-2 rounded text-[#003F72]"
                >
                    <span class="hidden sm:inline-block">Próximo</span>
                    <i class="inline-block sm:hidden bx bx-chevrons-right"></i>
                </button>
            </div>
            <ModalAuth
                :modal-value="showModalUser"
                @close="showModalUser = false"
            />
        </div>
    </MainLayout>
</template>
<style scoped></style>
