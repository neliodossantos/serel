<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import MainLayout from "@/layout/MainLayout.vue";
import ListPopularCompanies from "@/components/companies/list/ListPopularCompaniesComponent.vue";
import ListMostSearchedCompanies from "@/components/companies/list/ListMostSearchedCompaniesComponent.vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/users";
import ModalComponent from "@/components/ModalComponent.vue";
import { useToast } from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import { useNewsletterStore } from "@/stores/newslatter";
import { validators } from "@/utils/validators/validators";

const route = useRoute();
const search = ref("");
const showModalNewsletter = ref(false);
const isLoading = ref(true);
const isLoadingRequestNewsletter = ref(false);
const newsletterStore = useNewsletterStore();
const isFocusedModalNewsletter = ref(false);

const email = ref("");
function handleInput() {
    if (search.value !== "") {
        window.location.href = `/filter?q=${search.value}`;
    }
}
const userStore = useUserStore();
const toast = useToast();
const errors = {
    email: {
        valid: true,
        message: "",
    },
};

watch(
    () => email.value,
    () => {
        errors.email = validators.validateEmail(email.value);
    },
    { deep: true },
);

async function handleSubmitNewsletter() {
    try {
        errors.email = validators.validateEmail(email.value);
        if (errors.email.valid) {
        }
        isLoadingRequestNewsletter.value = true;
        const response = await newsletterStore.submitNewsletter({
            email: email.value,
        });
        if (response.success) {
            toast.success(response.message);
            email.value = "";
            showModalNewsletter.value = false;
        }
    } catch (e) {
        toast.error("Ocorreu um erro" + e);
    } finally {
        isLoadingRequestNewsletter.value = false;
    }
}

onMounted(async () => {
    setTimeout(() => {
        isLoading.value = false;
    }, 1000);
    if (!userStore.isLogged()) {
        setTimeout(() => {
            showModalNewsletter.value = true;
            setTimeout(() => {
                if (!isFocusedModalNewsletter.value) {
                    showModalNewsletter.value = false;
                }
            }, 16000);
        }, 3000);
    }
});
</script>
<template>
    <ModalComponent
        :isOpen="showModalNewsletter"
        @close="showModalNewsletter = false"
        maxWidth="xl">
        <div class="p-6">
            <div class="">
                <img
                    class="xxs:hidden max-w-32 sm:max-w-48 sm:max-h-48 mx-auto object-cover"
                    src="@/assets/img/Emails-bro.svg"
                    alt=""
                />
                <h1 class="text-2xl text-center font-bold">
                    Vamos manter contato
                </h1>
                <p class="max-w-[550px] text-center">
                    Inscreva-se para ficar por dentro das últimas notícias e
                    atualizações emocionantes.
                </p>
                <div class="my-3">
                    <form @submit.prevent="handleSubmitNewsletter">
                        <div class="relative">
                            <input
                                type="text"
                                v-model="email"
                                @focus="
                                    isFocusedModalNewsletter =
                                        !isFocusedModalNewsletter
                                "
                                placeholder="Digite o seu email"
                                class="w-full bg-gray-100 text-gray-800 border-2 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#003F72] focus:outline-none placeholder:text-gray-500 placeholder:xs:text-sm"
                            />
                            <button
                                type="submit"
                                class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#003F72] hover:bg-[#002a4d] text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
                                :class="{
                                    'opacity-50': isLoadingRequestNewsletter,
                                }"
                                :disabled="isLoadingRequestNewsletter"
                            >
                                Subscrever
                            </button>
                        </div>
                        <span
                            class="text-red-400 mt-1"
                            v-if="!errors.email.valid"
                            >{{ errors.email.message }}</span
                        >
                    </form>
                </div>
            </div>
        </div>
    </ModalComponent>
    <MainLayout>
        <div
            class="w-full md:h-[500px] bg-[#F8FAFB] dark:bg-[#000e1c] shadow flex items-center py-10">
            <div class="w-full px-[12%]">
                <div class="flex items-center gap-[64px] justify-between">
                    <div class="flex-1 text-center">
                        <button
                            class="xs:text-sm dark:text-white cursor-default border p-2 mb-3 rounded-lg shadow-sm flex items-center justify-center mx-auto gap-2">
                            <i
                                class="bx bx-star text-xl 3xl:text-2xl text-[#003F72] dark:text-white"></i>
                            Avaliações reais de funcionários
                        </button>
                        <h1
                            class="text-3xl mb-2.5 font-bold sm:text-4xl 2xl:text-5xl max-w-xl mx-auto text-[#2D2D2D] dark:text-white"
                        >
                            Descubra como é trabalhar nas melhores empresas!
                        </h1>
                        <p
                            class="hidden sm:block text-xl md:text-2xl max-w-[800px] mx-auto dark:text-gray-300"
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
                                class="absolute flex items-center gap-1 right-2 top-1/2 transform -translate-y-1/2 bg-[#003F72] hover:bg-[#002a4d] text-white rounded-md px-4 py-2 text-sm font-medium transition-colors">
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
        <ListPopularCompanies></ListPopularCompanies>
        <ListMostSearchedCompanies></ListMostSearchedCompanies>
    </MainLayout>
    <ToastContainer></ToastContainer>
</template>
<style>
.disable {
    background-color: #d1e9ff !important;
    color: #98a2b3;
}
</style>
