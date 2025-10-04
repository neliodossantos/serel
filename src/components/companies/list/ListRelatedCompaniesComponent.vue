<script setup lang="ts">
import { useUserStore } from "@/stores/users";
import { onMounted, ref } from "vue";
import router from "@/router";
import ModalAuth from "@/components/auth/ModalAuth.vue";
import { useCompanyStore } from "@/stores/companies";
import ItemCompanySkeleton from "@/components/skeleton/ItemCompanySkeleton.vue";
import ItemRelatedCompanyComponent from "@/components/companies/list/item/ItemRelatedCompanyComponent.vue";
import type { Company } from "@/types/Company";

const isLoading = ref(false);
const userStore = useUserStore();
const companyStore = useCompanyStore();
const companies = ref<Company[]>([]);
const isShowingPopular = ref(false);
const props = defineProps<{
    currentCompany: Company | null;
}>();

onMounted(async () => {
    try {
        isLoading.value = true;
        // Primeiro, tenta buscar empresas relacionadas por setor
        const relatedQuery = {
            filter: { sector: props.currentCompany?.sector },
            page: 1,
            limit: 4,
        };
        const relatedResponse = await companyStore.getAll(relatedQuery);

        // Filtra empresas que não tenham o mesmo ID da empresa atual
        const relatedCompanies = relatedResponse.data.companies.filter(
            (company: Company) => company.id !== props.currentCompany?.id,
        );

        if (relatedCompanies.length > 0) {
            companies.value = relatedCompanies.slice(0, 3);
            isShowingPopular.value = false;
        } else {
            const popularQuery = {
                filter: {},
                page: 1,
                limit: 4,
            };
            const popularResponse = await companyStore.getAll(popularQuery);

            // Filtra empresas que não tenham o mesmo ID da empresa atual
            companies.value = popularResponse.data.companies
                .filter(
                    (company: Company) =>
                        company.id !== props.currentCompany?.id,
                )
                .slice(0, 3);
            isShowingPopular.value = true;
        }
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
});
</script>
<template>
    <div class="px-[12%] sm:pt-8 pb-10 bg-[#F9F9F9] dark:bg-gray-900">
        <div class="flex items-center">
            <h1
                class="xxs:text-lg text-xl sm:text-2xl mt-10 3xl:text-3xl font-bold dark:text-white"
            >
                {{
                    isShowingPopular
                        ? "Empresas Populares"
                        : "Empresas Relacionadas"
                }}
            </h1>
        </div>
        <div
            class="grid pb-10 mt-10 gap-y-10 sm:gap-y-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-stretch gap-x-10"
        >
            <ItemCompanySkeleton
                v-if="isLoading"
                v-for="i in 3"
            ></ItemCompanySkeleton>
            <ItemRelatedCompanyComponent
                v-else
                v-for="company in companies"
                :key="company.id"
                :company="company"
            />
        </div>
    </div>
</template>
<style scoped></style>
