<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/users";
import ModalAuth from "@/components/auth/ModalAuth.vue";
import { useToast } from "@/composables/useToast";
import { validators } from "@/utils/validators/validators";
import { useNewsletterStore } from "@/stores/newslatter";
import { useTheme } from "@/composables/useTheme";
import logo from '@/assets/img/logo.png'
import logoWhite from '@/assets/img/logo_white.png'

const currentYear = ref(new Date().getFullYear());
const userStore = useUserStore();
const showMenuMobile = ref(false);
const showMenuUser = ref(false);
const showModalUser = ref(false);
const isLoadingRequestNewsletter = ref(false);
const newsletterStore = useNewsletterStore();
const { isDark, toggleTheme, initTheme } = useTheme();

onMounted(() => {
  initTheme();
});

const email = ref("");
const toast = useToast();
const errors = {
    email: {
        valid: true,
        message: "",
    },
};

async function handleSubmitNewsletter() {
    try {
        errors.email = validators.validateEmail(email.value);
        if (!errors.email.valid) {
            toast.error(errors.email.message);
            return;
        }
        isLoadingRequestNewsletter.value = true;
        const response = await newsletterStore.submitNewsletter({
            email: email.value,
        });
        if (response.success) {
            toast.success(response.message);
        }
        email.value = "";
    } catch (e) {
        toast.error("Ocorreu um erro" + e);
    } finally {
        isLoadingRequestNewsletter.value = false;
    }
}

function toggleMenuUser() {
    showMenuUser.value = !showMenuUser.value;
}
function toggleMenuMobile() {
    showMenuMobile.value = !showMenuMobile.value;
}

const goToReviewCompany = () => {
    if (userStore.isLogged()) {
        showModalUser.value = false;
        window.location.href = "/company/review";
    } else {
        localStorage.setItem("redirect", "/company/review");
        showModalUser.value = true;
    }
};
</script>
<template>
    <div class="w-full bg-[#F8FAFB]">
        <nav
            class="relative py-4 px-[8%] flex justify-between items-center bg-white border-b border-[#AEAEAE] dark:border-gray-700 dark:bg-gray-900">
            <a href="/" class="">
                <img class="md:max-w-[120px] max-w-[110px] object-cover"
                    :src=" isDark ? logoWhite : logo "
                    alt="Logo"/>
            </a>
            <button @click="toggleMenuMobile"
                id="mobile-menu-button"
                class="relative lg:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:text-white">
                <svg
                    class="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16m-7 6h7"
                    />
                </svg>
                <span class="w-5 h-5 rounded-full bg-red-500 text-white absolute top-0 left-3 text-center text-sm">1</span>
            </button>
            <div class="hidden gap-5 items-center lg:flex">
                <a href="/" class="text-black dark:text-white cursor-pointer">Pagina Inicial</a>
                <a href="/about" class="text-black dark:text-white cursor-pointer">Sobre nós</a>
                <a href="/contact" class="text-black dark:text-white cursor-pointer">Contacto</a>
                <a @click="goToReviewCompany"
                    class="px-5 py-2 rounded-lg cursor-pointer border-2 border-transparent bg-[#003F72] shadow-sm text-white font-bold">
                    Avaliar Empresa
                </a>
                <a v-if="userStore.token"
                    @click="toggleMenuUser"
                    class="cursor-pointer relative flex justify-end ml-3 h-full border-l-2 min-w-12 border-[#D4D2D0] font-bold">
                    <i class="bx bxs-user text-2xl dark:text-white"></i>
                    <span
                        class="w-5 h-5 rounded-full bg-white text-white border-4 hidden border-red-500 absolute -top-1 -right-2 text-center text-sm">
                    </span>
                    <ul v-if="showMenuUser"
                        class="w-36 md:min-w-full absolute top-10 -left-10 bg-white rounded shadow border">
                        <li class="p-2">
                            <a class="flex gap-2 cursor-pointer items-center justify-center p-2 text-black"
                                @click="userStore.logout">
                                <i class="bx bx-log-out"></i>Logout
                            </a>
                        </li>
                    </ul>
                </a>
                <div v-else
                    class="flex border-l-2 border-[#D4D2D0] pl-5 gap-2 items-center">
                    <a href="/login"
                        class="text-center cursor-pointer flex gap-2 items-center px-5 py-2 rounded-lg border-2 border-[#003F72] dark:border-white dark:hover:border-[#003F72] text-[#003F72] dark:text-white hover:bg-[#003F72] hover:text-white font-bold">
                        <i class="bx bx-user font-bold"></i>
                        Entrar
                    </a>
                </div>
                <a @click="toggleTheme"
                    class="flex px-3 py-2.5 rounded-lg border-2 text-xl outline-none dark:border-none dark:bg-white cursor-pointer border transition-colors">
                    <i :class="isDark ? 'bx bx-sun' : 'bx bx-moon'" class=""></i>
                </a>
            </div>
        </nav>
        <div v-if="showMenuMobile" class="lg:hidden navbar-menu relative z-50">
            <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25 dark:bg-gray-900 dark:opacity-50"></div>
            <nav class="fixed top-0 right-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white dark:bg-[#000e1a] border-r overflow-y-auto">
                <div class="flex justify-between mb-8">
                    <div class="">
                        <a class="cursor-pointer" href="/">
                            <img class="md:max-w-[120px] max-w-[90px]"
                                :src=" isDark ? logoWhite : logo " alt="Logo da Serel"/>
                        </a>
                    </div>
                    <button class="navbar-close" @click="toggleMenuMobile">
                        <svg class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <ul>
                    <li class="mb-1">
                        <a class="block cursor-pointer p-4 text-sm text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                            href="/">Pagina Inicial</a>
                    </li>
                    <li class="mb-1">
                        <a class="block cursor-pointer p-4 text-sm text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                            href="/about">Sobre nós</a>
                    </li>
                    <li class="mb-1">
                        <a class="block cursor-pointer p-4 text-sm text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                            href="/contact">Contacto</a>
                    </li>
                    <li class="mb-1">
                        <a @click="goToReviewCompany"
                            class="block cursor-pointer p-4 text-sm text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                            Avaliar Empresa
                        </a>
                    </li>
                    <li class="mb-1">
                        <button @click="toggleTheme"
                            class="block cursor-pointer p-4 text-sm text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded w-full text-left">
                            <i :class="isDark ? 'bx bx-sun' : 'bx bx-moon'" class="text-xl mr-2"></i>
                            {{ isDark ? 'Modo Claro' : 'Modo Escuro' }}
                        </button>
                    </li>
                </ul>
                <div class="mt-auto">
                    <div v-if="userStore.token">
                        <a
                            class="flex gap-2 items-center px-5 py-2.5 justify-center rounded-lg bg-[#003F72] text-white"
                            @click="userStore.logout">
                            <i class="bx bx-log-out"></i>
                            Logout
                        </a>
                    </div>
                    <div class="flex flex-col gap-3" v-else>
                        <a href="/login"
                            class="block text-center cursor-pointer px-5 py-2 rounded-lg bg-[#003F72] text-white font-bold">
                            Entrar
                        </a>
                        <a href="/signup"
                            class="px-5 py-2 text-center rounded-lg border-2 border-[#003F72] text-[#003F72] font-bold">
                            Registrar
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    </div>
    <slot></slot>
    <ModalAuth :modal-value="showModalUser"
        @close="showModalUser = false"></ModalAuth>
    <footer class="w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
        <div class="px-[8%] py-12">
            <div
                class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 lg:gap-32 gap-16">
                <div class="col-span-2 md:col-span-1 lg:col-span-2">
                    <a href="/" class="block mb-6">
                        <img class="max-w-[130px]" 
                        :src=" isDark ? logoWhite : logo "
                        alt="Serel Logo"/>
                    </a>
                    <p class="text-gray-600 dark:text-gray-300 mb-3">
                        A plataforma onde funcionários compartilham experiências
                        e salários de forma anônima, ajudando outros a conhecer
                        melhor as empresas.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="rounded transition-colors">
                            <img class="w-8 h-8" src="https://img.icons8.com/?size=100&id=118490&format=png&color=003F72"
                                alt="Facebook"/>
                        </a>
                        <a href="#"
                            class="text-gray-400 hover:text-white transition-colors">
                            <img class="w-8 h-8"
                                src="https://img.icons8.com/?size=100&id=84884&format=png&color=003F72"
                                alt="Instagram"/>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <img class="w-8 h-8" src="https://img.icons8.com/?size=100&id=8808&format=png&color=003F72"
                                alt="Twitter"/>
                        </a>
                        <a href="#"
                            class="text-gray-400 hover:text-white transition-colors">
                            <img class="w-8 h-8"
                                src="https://img.icons8.com/?size=100&id=6zD8nvJF2ndM&format=png&color=003F72"
                                alt="LinkedIn"/>
                        </a>
                    </div>
                </div>
                <div>
                    <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-4">
                        Links Úteis
                    </h3>
                    <ul class="space-y-2">
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                href="/login">Login</a>
                        </li>
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                href="/signup">Registrar</a>
                        </li>
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                href="/contact">Contacto</a>
                        </li>
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                href="/about">Sobre Nós</a>
                        </li>
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                href="/faq">FAQ</a>
                        </li>
                    </ul>
                </div>
                <div class="">
                    <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-4">
                        Empresa
                    </h3>
                    <ul class="space-y-2">
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                href="/">Inicio</a>
                        </li>
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                @click="goToReviewCompany">Avaliar</a>
                        </li>
                        <li>
                            <a class="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
                                href="/filter?q=">Pesquisar Empresa</a>
                        </li>
                    </ul>
                </div>
                <div class="col-span-2">
                    <h3 class="text-gray-900 dark:text-white font-bold text-lg mb-4">
                        Newsletter
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">
                        Obtenha inspiração exclusiva para a sua próxima estadia.
                    </p>
                    <form
                        @submit.prevent="handleSubmitNewsletter"
                        class="space-y-3">
                        <div class="relative">
                            <input type="text" v-model="email"
                                placeholder="Digite o seu email"
                                class="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#003F72] focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 placeholder:xs:text-sm"/>
                            <button type="submit"
                                class="absolute right-1 top-1/2 transform -translate-y-1/2 bg-[#003F72] hover:bg-[#002a4d] text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
                                :class="{
                                    'opacity-50': isLoadingRequestNewsletter,
                                }"
                                :disabled="isLoadingRequestNewsletter">
                                Subscrever
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 py-6 bg-gray-50 dark:bg-gray-900">
            <div class="px-[8%] flex flex-col md:flex-row justify-between items-center">
                <p class="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
                    © {{ currentYear }} Serel. Todos os direitos reservados.
                </p>
                <div class="flex space-x-6">
                    <a href="/privacy"
                        class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Política de Privacidade</a>
                    <a href="/terms"
                        class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Termos de Uso</a>
                    <a href="/cookies"
                        class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">Cookies</a>
                </div>
            </div>
        </div>
    </footer>
</template>
<style scoped>
.disable {
    background-color: #d1e9ff !important;
    color: #98a2b3;
}
</style>