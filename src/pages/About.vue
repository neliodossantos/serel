<script lang="ts" setup>
import { ref } from "vue";
import MainLayout from "@/layout/MainLayout.vue";
import {useUserStore} from "@/stores/users";
import ModalAuth from "@/components/auth/ModalAuth.vue";

const userStore = useUserStore();
const showModalUser = ref(false);
const goToReviewCompany = () => {
    if (userStore.isLogged()) {
        showModalUser.value = false;
        window.location.href = "/company/review";
    } else {
        localStorage.setItem("redirect", "/company/review");
        showModalUser.value = true;
    }
};
const stats = ref([
    {
        number: "10,000+",
        label: "Avaliações Registradas",
        icon: "bx-star",
    },
    {
        number: "5,000+",
        label: "Empresas Avaliadas",
        icon: "bx-buildings",
    },
    {
        number: "50,000+",
        label: "Usuários Ativos",
        icon: "bx-group",
    },
    {
        number: "99%",
        label: "Satisfação dos Usuários",
        icon: "bx-heart",
    },
]);
const features = ref([
    {
        title: "Transparência Total",
        description:
            "Oferecemos uma plataforma onde a transparência é prioridade. Todas as avaliações são verificadas e mantemos um ambiente seguro para compartilhar experiências.",
        icon: "bx bx-check-circle",
    },
    {
        title: "Anonimato Garantido",
        description:
            "Protegemos a identidade dos nossos usuários. Você pode compartilhar sua experiência sem medo de represálias ou exposição desnecessária.",
        icon: "bx-user-check",
    },
    {
        title: "Dados Confiáveis",
        description:
            "Nossas informações são baseadas em experiências reais de funcionários. Validamos cada avaliação para garantir autenticidade e relevância.",
        icon: "bx-data",
    },
    {
        title: "Comunidade Ativa",
        description:
            "Faça parte de uma comunidade engajada que se ajuda mutuamente na busca por melhores oportunidades de carreira.",
        icon: "bx-group",
    },
]);
</script>
<template>
    <MainLayout>
        <ModalAuth :modal-value="showModalUser"
                   @close="showModalUser = false"></ModalAuth>
        <!-- Hero Section -->
        <div
            class="w-full md:h-[400px] bg-[#F8FAFB] shadow flex items-center py-10">
            <div class="w-full px-[12%]">
                <div class="flex items-center gap-[64px] justify-between">
                    <div class="flex-1 text-center">
                        <button
                            class="xs:text-sm cursor-default border p-2 mb-3 rounded-lg shadow-sm flex items-center justify-center mx-auto gap-2"
                        >
                            <i
                                class="bx bx-help-circle text-xl 3xl:text-2xl text-[#003F72]"
                            ></i>
                            Saiba mais sobre Serel
                        </button>
                        <h1
                            class="text-3xl mb-2.5 font-bold sm:text-4xl 2xl:text-5xl max-w-xl mx-auto text-[#2D2D2D]"
                        >
                            Sobre a Serel
                        </h1>
                        <p
                            class="hidden sm:block text-xl md:text-2xl max-w-[800px] mx-auto"
                        >
                            Conectamos talentos com oportunidades através da
                            transparência e experiências reais compartilhadas
                            por funcionários.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Mission Section -->
        <div class="w-full bg-white py-20">
            <div class="px-[8%] max-w-7xl mx-auto">
                <div
                    class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                >
                    <div>
                        <h2
                            class="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-6"
                        >
                            Nossa Missão
                        </h2>
                        <p class="text-lg text-gray-600 mb-6 leading-relaxed">
                            Democratizar o acesso a informações sobre empresas e
                            ambientes de trabalho, capacitando profissionais a
                            tomarem decisões de carreira mais informadas.
                        </p>
                        <p class="text-lg text-gray-600 mb-8 leading-relaxed">
                            Acreditamos que cada pessoa merece trabalhar em um
                            ambiente que valorize seu talento e bem-estar. Por
                            isso, criamos uma plataforma onde a transparência e
                            a autenticidade são os pilares fundamentais.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <div class="flex items-center gap-3">
                                <i
                                    class="bx bx-check-circle text-2xl text-[#003F72]"
                                ></i>
                                <span class="font-semibold"
                                    >Transparência Total</span
                                >
                            </div>
                            <div class="flex items-center gap-3">
                                <i
                                    class="bx bx-shield-check text-2xl text-[#003F72]"
                                ></i>
                                <span class="font-semibold"
                                    >Segurança Garantida</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="relative">
                        <img
                            src="@/assets/img/3c8641b2-0a65-4b28-b428-99a7d9a408ce.png"
                            alt="Equipe trabalhando"
                            class="rounded-2xl max-h-full shadow-2xl w-full object-contain"
                        />
                        <div
                            class="absolute inset-0 bg-[#003F72] opacity-10 rounded-2xl"
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats Section -->
        <div class="w-full bg-[#F8FAFB] py-20 hidden">
            <div class="px-[8%] max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2
                        class="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4"
                    >
                        Números que Falam
                    </h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Nossa comunidade cresce a cada dia, construindo a maior
                        base de dados de avaliações empresariais do país.
                    </p>
                </div>
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    <div
                        v-for="stat in stats"
                        :key="stat.label"
                        class="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <i
                            :class="`bx ${stat.icon} text-4xl text-[#003F72] mb-4`"
                        ></i>
                        <h3 class="text-3xl font-bold text-[#2D2D2D] mb-2">
                            {{ stat.number }}
                        </h3>
                        <p class="text-gray-600 font-medium">
                            {{ stat.label }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Features Section -->
        <div class="w-full bg-white py-20">
            <div class="px-[8%] max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2
                        class="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4"
                    >
                        Por que Escolher a Serel?
                    </h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Oferecemos uma experiência única baseada em valores
                        sólidos e tecnologia de ponta.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div
                        v-for="feature in features"
                        :key="feature.title"
                        class="flex gap-6 group"
                    >
                        <div class="flex-shrink-0">
                            <div
                                class="w-16 h-16 bg-[#003F72] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                            >
                                <i
                                    :class="`bx ${feature.icon} text-2xl text-white`"
                                ></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-[#2D2D2D] mb-3">
                                {{ feature.title }}
                            </h3>
                            <p class="text-gray-600 leading-relaxed">
                                {{ feature.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Values Section -->
        <div class="w-full py-20" :class="[ userStore.isLogged() ? 'bg-gradient-to-r from-[#003F72] to-[#0056A3]' : 'bg-white' ]">
            <div class="px-[8%] max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2
                        class="text-3xl md:text-4xl font-bold mb-4"  :class="[ userStore.isLogged() ? 'text-white' : 'text-[#2D2D2D]']">
                        Nossos Valores
                    </h2>
                    <p class="text-lg max-w-2xl mx-auto" :class="[ userStore.isLogged() ? 'text-white' : 'text-gray-600']">
                        Princípios que guiam cada decisão e ação em nossa
                        jornada.
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="text-center p-8 " :class="[ userStore.isLogged() ? 'text-white' : 'text-black']">
                        <i class="bx bx-heart text-4xl mb-6" :class="[ userStore.isLogged() ? 'text-white' : 'text-[#003F72]']"></i>
                        <h3 class="text-2xl font-bold mb-4" :class="[ userStore.isLogged() ? 'text-white' : 'text-black']">Empatia</h3>
                        <p class="leading-relaxed opacity-90">
                            Compreendemos os desafios do mercado de trabalho e
                            criamos soluções com o coração.
                        </p>
                    </div>
                    <div class="text-center p-8 text-black">
                        <i class="bx bx-leaf text-4xl mb-6" :class="[ userStore.isLogged() ? 'text-white' : 'text-[#003F72]']"></i>
                        <h3 class="text-2xl font-bold mb-4" :class="[ userStore.isLogged() ? 'text-white' : 'text-black']">Integridade</h3>
                        <p class="leading-relaxed opacity-90" :class="[ userStore.isLogged() ? 'text-white' : 'text-black']">
                            Mantemos os mais altos padrões éticos em todas as
                            nossas interações e processos.
                        </p>
                    </div>
                    <div class="text-center p-8 text-black">
                        <i class="bx bx-rocket text-4xl mb-6" :class="[ userStore.isLogged() ? 'text-white' : 'text-[#003F72]']"></i>
                        <h3 class="text-2xl font-bold mb-4" :class="[ userStore.isLogged() ? 'text-white' : 'text-black']">Inovação</h3>
                        <p class="leading-relaxed opacity-90" :class="[ userStore.isLogged() ? 'text-white' : 'text-black']">
                            Buscamos constantemente novas formas de melhorar a
                            experiência de nossos usuários.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div v-if="!userStore.isLogged()"
            class="w-full bg-gradient-to-r from-[#003F72] to-[#0056A3] text-white py-20">
            <div class="px-[8%] max-w-7xl mx-auto text-center">
                <h2 class="text-3xl md:text-4xl font-bold mb-6">
                    Faça Parte da Nossa Comunidade
                </h2>
                <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    Junte-se a milhares de profissionais que já descobriram como
                    é trabalhar nas melhores empresas.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="/signup"
                        class="px-8 py-4 bg-white text-[#003F72] rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300 inline-flex items-center justify-center gap-2"
                    >
                        <i class="bx bx-user-plus text-xl"></i>
                        Criar Conta
                    </a>
                    <a  @click="goToReviewCompany"
                        class="px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-[#003F72] transition-all duration-300 inline-flex items-center justify-center gap-2">
                        <i class="bx bx-star text-xl"></i>
                        Avaliar Empresa
                    </a>
                </div>
            </div>
        </div>
    </MainLayout>
</template>
<style scoped>
</style>
