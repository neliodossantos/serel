<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import OverviewCompany from "@/components/companies/overview/OverviewCompany.vue";
import MainLayout from "@/layout/MainLayout.vue";
import ListRelatedCompanies from "@/components/companies/list/ListRelatedCompaniesComponent.vue";
import { useCompanyStore } from "@/stores/companies";
import type { Company } from "@/types/Company";
import PreloaderComponent from "@/components/PreloaderComponent.vue";
import { useUserStore } from "@/stores/users";
import ModalComponent from "@/components/ModalComponent.vue";
import ErrorReconnectComponent from "@/components/ErrorReconnectComponent.vue";

const route = useRoute();
const companyStore = useCompanyStore();
const userStore = useUserStore();
const isLoading = ref(false);
const company = reactive<Company>({});
const showModalReview = ref(false);
const hasError = ref(false);
const errorMessage = ref('Não foi possível carregar as informações da empresa.');
const errorCode = ref(0);

const filledStars = (rating: number) => Math.floor(rating ?? 0);
const hasHalfStar = (rating: number) => (rating ?? 0) % 1 >= 0.5;
const emptyStars = (rating: number) => {
    const hadHalfStar = hasHalfStar(rating);
    const fillStars = filledStars(rating);
    return 5 - fillStars - (hadHalfStar ? 1 : 0);
};

onMounted(async () => {
    try {
        isLoading.value = true;
        hasError.value = false;

        // Importar o utilitário diretamente no componente
        const { isConnected, handleApiError } = await import('@/utils/api');

        if (!isConnected()) {
            hasError.value = true;
            errorMessage.value = 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
            return;
        }

        const companyId = route.params.companyId;
        const response = await companyStore.getOne({
            filter: { id: companyId },
            page: 1,
            limit: 1,
        });

        if (!response || !response.data) {
            hasError.value = true;
            errorMessage.value = 'Não foi possível carregar as informações da empresa.';
            return;
        }

        Object.assign(company, response.data);
    } catch (e: any) {
        console.error(e);
        hasError.value = true;

        // Usar o utilitário de tratamento de erros
        const { handleApiError } = await import('@/utils/api');
        const apiError = handleApiError(e, 'Ocorreu um erro ao carregar os dados da empresa.');

        errorCode.value = apiError.code;
        errorMessage.value = apiError.message;
    } finally {
        isLoading.value = false;
    }
});

function toggleShowModalReview() {
    showModalReview.value = !showModalReview.value;
}
</script>
<template>
    <ModalComponent 
        :isOpen="showModalReview" 
        @close="showModalReview = false"
        title="Avaliar empresa"
        maxWidth="xl"
    >
        <div class="p-6 sm:p-8">
            <div class="flex flex-col items-center">
                <img
                    class="block mx-auto w-20 h-20 object-cover rounded-lg shadow-sm"
                    :src="company.logo"
                    :alt="`Logo da empresa ${company.name}`"
                />
                <div class="mt-4 text-center">
                    <h2 class="text-lg md:text-xl font-medium">
                        Como você gostaria de avaliar
                        <span class="font-bold text-[#003F72]">{{ company.name }}</span>?
                    </h2>
                    <p class="text-gray-500 mt-1">Escolha uma das opções abaixo</p>
                </div>
            </div>

            <div class="w-full mt-6 flex flex-col sm:flex-row gap-4">
                <a
                    class="flex-1 flex items-center gap-3 justify-center p-4 bg-[#003F72] hover:bg-[#002a4d] transition-colors rounded-lg shadow-sm text-white text-center"
                    :href="`/company/${company.id}/review`"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#fff"
                            d="m12 17.275l-4.15 2.5q-.275.175-.575.15t-.525-.2t-.35-.437t-.05-.588l1.1-4.725L3.775 10.8q-.25-.225-.312-.513t.037-.562t.3-.45t.55-.225l4.85-.425l1.875-4.45q.125-.3.388-.45t.537-.15t.537.15t.388.45l1.875 4.45l4.85.425q.35.05.55.225t.3.45t.038.563t-.313.512l-3.675 3.175l1.1 4.725q.075.325-.05.588t-.35.437t-.525.2t-.575-.15z"
                        />
                    </svg>
                    <span class="font-bold">Experiência</span>
                </a>
                <a
                    class="flex-1 group flex items-center gap-3 text-[#003F72] justify-center p-4 border-2 border-[#003F72] hover:text-white hover:bg-[#003F72] transition-colors rounded-lg shadow-sm text-center"
                    :href="`/company/${company.id}/salary`"
                >
                    <svg
                        class="w-6 h-6 group-hover:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="currentColor"
                            d="M16 12c2.76 0 5-2.24 5-5s-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5m5.45 5.6c-.39-.4-.88-.6-1.45-.6h-7l-2.08-.73l.33-.94L13 16h2.8c.35 0 .63-.14.86-.37s.34-.51.34-.82c0-.54-.26-.91-.78-1.12L8.95 11H7v9l7 2l8.03-3c.01-.53-.19-1-.58-1.4M5 11H.984v11H5z"
                        />
                    </svg>
                    <span class="font-bold">Salário</span>
                </a>
            </div>
        </div>
    </ModalComponent>
    <ErrorReconnectComponent 
        v-if="hasError" 
        :message="errorMessage"
        :error-code="errorCode"
        reload-button-text="Recarregar página"
    />
    <PreloaderComponent v-else-if="isLoading"></PreloaderComponent>
    <MainLayout v-else>
        <div
            class="w-full bg-[#F8FAFB] flex items-center md:border-none border-b border-[#D4D2D0] md:py-0"
        >
            <div class="w-full mt-10 md:mt-20 min-h-auto px-[12%]">
                <div
                    class="flex lg:gap-16 justify-between items-center flex-wrap gap-4 xs:gap-2"
                >
                    <div class="flex items-start gap-5">
                        <img
                            @click="
                                router.push('/overview/company/' + company.id)
                            "
                            class="mt-1.5 sm:mt-0 cursor-pointer xxs:max-w-20 xxs:max-h-20 xs:w-24 xs:h-24 w-32 h-32 object-cover rounded"
                            :src="company.logo"
                            :alt="'Logo da empresa' + company.name"
                        />
                        <div class="xs:mb-2">
                            <h2 class="xs:text-base font-600 text-xl sm:mb-2">
                                {{ company.name }}
                            </h2>
                            <span class="xxs:hidden xs:text-sm text-md"
                                ><i class="bx bx-map mr-1"></i
                                >{{ company.address?.city }},
                                {{ company.address?.country }}</span
                            >
                            <div
                                class="flex my-1 sm:my-2 items-center xxs:gap-0 gap-1 flex-wrap"
                            >
                                <i
                                    v-for="n in filledStars(
                                        company.rating?.average ?? 0,
                                    )"
                                    :key="'filled-' + n"
                                    class="bx bxs-star text-xl sm:text-2xl text-[#003F72]"
                                ></i>
                                <i
                                    v-if="
                                        hasHalfStar(
                                            company.rating?.average ?? 0,
                                        )
                                    "
                                    class="bx bxs-star-half text-[#003F72] text-xl sm:text-2xl"
                                ></i>
                                <i
                                    v-for="n in emptyStars(
                                        company.rating?.average ?? 0,
                                    )"
                                    :key="'empty-' + n"
                                    class="bx bx-star text-xl sm:text-2xl text-[#003F72]"
                                ></i>
                                <div class="">
                                    <span class="xxs:text-sm text-md ml-1"
                                        >{{
                                            company.rating?.average
                                                ? company.rating?.average
                                                : 0
                                        }}/5</span
                                    >
                                </div>
                            </div>
                            <span
                                class="block xs:hidden text-sm text-gray-500 underline"
                                >{{ company.sector }}</span
                            >
                        </div>
                    </div>
                    <div
                        class="w-full xs:max-w-72 sm:max-w-md rounded md:w-auto"
                    >
                        <a
                            @click="toggleShowModalReview"
                            class="cursor-pointer max-w-full text-center block lg:inline bg-[#003F72] py-[12px] md:py-[18px] md:px-[45px] rounded text-white border-none"
                            >Avaliar empresa</a
                        >
                    </div>
                </div>
                <div class="xs:my-5 my-10">
                    <div class="">
                        <ul class="md:border-b md:border-gray-300 flex gap-3">
                            <li
                                class="list-none pb-1 border-b-[4px] border-[#003F72]"
                            >
                                <a
                                    :href="'/overview/company/' + company.id"
                                    class="cursor-pointer text-[#003F72] text-md xs:text-sm py-4 font-bold"
                                    >Visão Geral</a
                                >
                            </li>
                            <li class="list-none pb-1">
                                <a
                                    :href="'/reviews/company/' + company.id"
                                    class="cursor-pointer text-[#003F72] text-md xs:text-sm py-3 font-bold"
                                    >Avaliações</a
                                >
                            </li>
                            <li class="list-none pb-1">
                                <a
                                    :href="'/salaries/company/' + company.id"
                                    class="cursor-pointer text-[#003F72] text-md xs:text-sm py-3 font-bold"
                                    >Salários</a
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <OverviewCompany :currentCompany="company"></OverviewCompany>
        <div class="mt-32">
            <ListRelatedCompanies
                :currentCompany="company || null"
            ></ListRelatedCompanies>
        </div>
    </MainLayout>
</template>
<style scoped></style>
