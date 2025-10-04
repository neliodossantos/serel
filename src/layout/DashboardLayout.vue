<script setup lang="ts">
import { onMounted, ref } from "vue";
import PreloaderComponent from "@/components/PreloaderComponent.vue";

const currentYear = ref(new Date().getFullYear());
const showDescriptionMenu = ref(false);
const showMenuUser = ref(false);
const isLoading = ref(true);
function toggleMenu() {
    if (window.innerWidth <= 768) {
        showDescriptionMenu.value = false;
        return;
    }
    showDescriptionMenu.value = !showDescriptionMenu.value;
}

function toggleMenuUser() {
    showMenuUser.value = !showMenuUser.value;
}

onMounted(() => {
    setTimeout(() => {
        isLoading.value = false;
    }, 3000);
});
</script>
<template>
    <PreloaderComponent v-if="isLoading"></PreloaderComponent>
    <div v-else class="min-h-screen flex">
        <!-- Sidebar -->
        <div
            :class="[
                'fixed transition duration-300 top-0 left-0 h-full bg-white border-r shadow-lg flex flex-col',
                showDescriptionMenu ? 'md:w-64' : 'md:w-20',
            ]"
            class=""
        >
            <!-- Menu Items -->
            <nav class="p-4">
                <ul class="hidden md:block space-y-2">
                    <li>
                        <button
                            @click="toggleMenu"
                            class="flex items-center gap-5 p-2 rounded-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-8 h-8"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button
                            :class="showDescriptionMenu ? '' : 'justify-center'"
                            class="w-full flex gap-5 items-center p-2 rounded-lg hover:bg-[#003F72] hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                width="24"
                                height="24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                                />
                            </svg>
                            <span
                                :class="
                                    showDescriptionMenu ? 'block' : 'hidden'
                                "
                                class=""
                                >Empresas</span
                            >
                        </button>
                    </li>
                    <li>
                        <button
                            :class="showDescriptionMenu ? '' : 'justify-center'"
                            class="w-full flex gap-5 items-center p-2 rounded-lg hover:bg-[#003F72] hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12.3 12.22A4.92 4.92 0 0 0 14 8.5a5 5 0 0 0-10 0a4.92 4.92 0 0 0 1.7 3.72A8 8 0 0 0 1 19.5a1 1 0 0 0 2 0a6 6 0 0 1 12 0a1 1 0 0 0 2 0a8 8 0 0 0-4.7-7.28M9 11.5a3 3 0 1 1 3-3a3 3 0 0 1-3 3m9.74.32A5 5 0 0 0 15 3.5a1 1 0 0 0 0 2a3 3 0 0 1 3 3a3 3 0 0 1-1.5 2.59a1 1 0 0 0-.5.84a1 1 0 0 0 .45.86l.39.26l.13.07a7 7 0 0 1 4 6.38a1 1 0 0 0 2 0a9 9 0 0 0-4.23-7.68"
                                />
                            </svg>
                            <span
                                :class="
                                    showDescriptionMenu ? 'block' : 'hidden'
                                "
                                class=""
                                >Empresas</span
                            >
                        </button>
                    </li>
                    <li>
                        <button
                            :class="showDescriptionMenu ? '' : 'justify-center'"
                            class="w-full flex gap-5 items-center p-2 rounded-lg hover:bg-[#003F72] hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M6 13H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1m-1 8H3v-6h2ZM22 9h-4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1m-1 12h-2V11h2ZM14 1h-4a1 1 0 0 0-1 1v20a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1m-1 20h-2V3h2Z"
                                />
                            </svg>
                            <span
                                :class="
                                    showDescriptionMenu ? 'block' : 'hidden'
                                "
                                class=""
                                >Empresas</span
                            >
                        </button>
                    </li>
                    <li>
                        <button
                            :class="showDescriptionMenu ? '' : 'justify-center'"
                            class="w-full flex gap-5 items-center p-2 rounded-lg hover:bg-[#003F72] hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M19 5.5h-6.28l-.32-1a3 3 0 0 0-2.84-2H5a3 3 0 0 0-3 3v13a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-10a3 3 0 0 0-3-3m1 13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-13a1 1 0 0 1 1-1h4.56a1 1 0 0 1 .95.68l.54 1.64a1 1 0 0 0 .95.68h7a1 1 0 0 1 1 1Z"
                                />
                            </svg>
                            <span
                                :class="
                                    showDescriptionMenu ? 'block' : 'hidden'
                                "
                                class=""
                                >Empresas</span
                            >
                        </button>
                    </li>
                </ul>
                <ul class="block md:hidden space-y-2">
                    <li>
                        <button
                            @click="toggleMenu"
                            class="flex justify-center items-center p-2 rounded-lg"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-8 h-8"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button
                            class="w-full flex justify-center items-center p-2 rounded-lg hover:bg-[#003F72] hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                width="24"
                                height="24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                                />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button
                            class="w-full flex justify-center items-center p-2 rounded-lg hover:bg-[#003F72] hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M12.3 12.22A4.92 4.92 0 0 0 14 8.5a5 5 0 0 0-10 0a4.92 4.92 0 0 0 1.7 3.72A8 8 0 0 0 1 19.5a1 1 0 0 0 2 0a6 6 0 0 1 12 0a1 1 0 0 0 2 0a8 8 0 0 0-4.7-7.28M9 11.5a3 3 0 1 1 3-3a3 3 0 0 1-3 3m9.74.32A5 5 0 0 0 15 3.5a1 1 0 0 0 0 2a3 3 0 0 1 3 3a3 3 0 0 1-1.5 2.59a1 1 0 0 0-.5.84a1 1 0 0 0 .45.86l.39.26l.13.07a7 7 0 0 1 4 6.38a1 1 0 0 0 2 0a9 9 0 0 0-4.23-7.68"
                                />
                            </svg>
                        </button>
                    </li>
                    <li>
                        <button
                            class="w-full flex justify-center items-center p-2 rounded-lg hover:bg-[#003F72] hover:text-white"
                        >
                            <i class="bx bxs-bar-chart-alt-2 text-2xl"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
        <div
            :class="[
                'flex-1 transition-all duration-300',
                showDescriptionMenu ? 'md:ml-64' : 'md:ml-20',
            ]"
            class="ml-20"
        >
            <!-- Header -->
            <header
                :class="[showDescriptionMenu ? 'left-64' : 'left-20']"
                class="fixed top-0 right-0 bg-[#003F72] text-white p-4 z-10"
            >
                <div class="flex justify-between items-center">
                    <div>
                        <img
                            class="max-w-[120px]"
                            src="@/assets/img/logo_white.png"
                            alt=""
                        />
                    </div>
                    <div
                        @click="toggleMenuUser"
                        class="relative cursor-pointer flex items-center space-x-2 pr-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span class="md:block hidden"
                            >neliodossantos15@gmail.com</span
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="3"
                            stroke="currentColor"
                            class="mt-1 size-4"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                        <ul
                            v-if="showMenuUser"
                            class="w-36 md:min-w-full absolute top-8 right-0 bg-white rounded shadow border"
                        >
                            <li class="p-2">
                                <a
                                    class="flex gap-2 items-center justify-center p-2 text-black"
                                    href=""
                                >
                                    <i class="bx bx-log-out"></i>Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <div class="flex-1 p-6 mt-[72px] overflow-auto bg-white">
                <div class="flex-1 p-6 overflow-auto bg-white">
                    <slot></slot>
                </div>
            </div>
            <footer class="py-10 px-5 flex flex-col gap-5 text-sm bg-gray-100">
                <div class="">© {{ currentYear }} Serel</div>
                <div class="flex flex-wrap space-x-2">
                    <a href="#" class="hover:text-gray-900 underline"
                        >Cookies, privacidade e termos
                    </a>
                    <span>-</span>
                    <a href="#" class="hover:text-gray-900 underline">
                        Centro de privacidade
                    </a>
                    <span>-</span>
                    <a href="#" class="hover:text-gray-900 underline">
                        Segurança
                    </a>
                    <span>-</span>
                    <a href="#" class="hover:text-gray-900 underline">
                        Contato
                    </a>
                </div>
            </footer>
        </div>
    </div>
</template>
