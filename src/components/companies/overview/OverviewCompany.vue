<script setup lang="ts">
import OverviewReviews from "@/components/companies/overview/list/OverviewReviews.vue";
import OverviewSalary from "@/components/companies/overview/list/OverviewSalary.vue";
import type { Company } from "@/types/Company";

const props = defineProps<{ currentCompany: Company }>();
</script>
<template>
    <div class="px-[12%]">
        <h1 class="text-xl sm:text-2xl font-bold text-[#2D2D2D] dark:text-white mt-10">
            Sobre a empresa
        </h1>
        <div
            class="mt-10 grid grid-cols-2 lg:grid-cols-4 max-w-2xl gap-4 md:gap-5 mb-10"
        >
            <div
                class="border border-[#D4D2D0] min-h-[130px] justify-between shadow-sm py-3 px-4 rounded-lg flex flex-col gap-y-3"
            >
                <h2 class="pt-2 font-bold md:text-normal text-sm dark:text-white">
                    Tamanho da empresa
                </h2>
                <span class="block text-[#2D2D2D] xs:text-sm dark:text-white"
                    >De {{ currentCompany.size?.min }} a
                    {{ currentCompany.size?.max }}</span
                >
            </div>
            <div
                class="border border-[#D4D2D0] min-h-[130px] justify-between shadow-sm py-3 xs:px-2.5 px-4 rounded-lg flex flex-col gap-y-3"
            >
                <h2 class="pt-2 font-bold text-sm dark:text-white">Setor</h2>
                <span
                    class="max-w-[90px] md:mt-[20px] block xs:text-sm text-[#2D2D2D] dark:text-white"
                    >{{ currentCompany.sector }}</span
                >
            </div>
            <div
                class="border border-[#D4D2D0] min-h-[130px] shadow-sm justify-between py-3 xs:px-2.5 px-4 rounded-lg flex flex-col gap-y-3"
            >
                <h2 class="pt-2 font-bold text-sm dark:text-white">Matriz</h2>
                <span class="text-[#595959] xs:text-sm block dark:text-white">{{
                    currentCompany.address?.country
                }}</span>
            </div>
            <div
                class="border border-[#D4D2D0] min-h-[130px] justify-between shadow-sm py-3 xs:px-2.5 px-4 rounded-lg flex flex-col gap-y-3"
            >
                <h2 class="pt-2 font-bold text-sm dark:text-white">Link</h2>
                <div class="dark:text-white">
                    <a
                        class="mt-2 block uppercase underline xs:text-sm text-[#003F72] max-w-full truncate dark:text-white"
                        :href="currentCompany.website"
                        target="_blank"
                        >{{ currentCompany.name }}</a
                    >
                    <i class="bx bx-link-external block"></i>
                </div>
            </div>
        </div>
        <div
            class="max-w-full sm:max-w-[95%] lg:max-w-[70%] my-5 text-[#595959] dark:text-gray-300"
        >
            <p class="sm:pr-10">{{ currentCompany.description }}</p>
        </div>
        <div class="my-10">
            <div class="my-10 md:my-24">
                <OverviewSalary></OverviewSalary>
            </div>
        </div>
    </div>
    <div class="px-[12%] my-3">
        <h1 class="text-xl sm:text-2xl font-bold dark:text-white">Avaliações</h1>
        <div
            class="grid grid-cols-1 w-full gap-x-10 lg:gap-x-20 gap-y-4 md:grid-cols-2 xl:grid-cols-3"
        >
            <div class="col-span-2">
                <OverviewReviews
                    :currentCompany="currentCompany"
                ></OverviewReviews>
            </div>
            <div class="mt-4 col-span-2 md:col-span-1">
                <div class="xl:px-8 dark:text-white">
                    <h2 class="md:text-2xl pr-5 text-xl font-bold">
                        O que você diria sobre a empresa em que trabalha?
                    </h2>
                    <p class="my-3 sm:max-w-[250px]">
                        Ajude outros candidatos compartilhando sua experiência
                        única.
                    </p>
                </div>
                <div
                    class="bg-white border lg:h-[180px] w-full rounded-md mt-3 relative flex justify-center items-center shadow-md"
                >
                    <img
                        class="max-w-full h-full object-cover rounded"
                        src="../../../assets/img/367ca6d2f0870793255c56ac75551e5d.png"
                        alt=""
                    />
                    <a
                        :href="`/company/${currentCompany.id}/review`"
                        class="bg-[#003F72] hover:bg-[#002a4d] absolute sm:top-5 top-3 border-none px-8 py-3 rounded text-white font-bold"
                        >Escreva uma avaliação</a>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped></style>
