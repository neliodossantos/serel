<script lang="ts" setup>
import { ref } from "vue";
import MainLayout from "@/layout/MainLayout.vue";

const activeAccordion = ref<number | null>(null);
const openCategories = ref<Set<number>>(new Set([0]));

const toggleAccordion = (index: number) => {
    activeAccordion.value = activeAccordion.value === index ? null : index;
};

const toggleCategory = (categoryIndex: number) => {
    if (openCategories.value.has(categoryIndex)) {
        openCategories.value.delete(categoryIndex);
    } else {
        openCategories.value.add(categoryIndex);
    }
};

const faqs = ref([
    {
        category: "Geral",
        questions: [
            {
                question: "O que é a Serel?",
                answer: "A Serel é uma plataforma online onde funcionários atuais e antigos podem compartilhar avaliações anônimas sobre suas experiências de trabalho, incluindo informações sobre salários, cultura empresarial, benefícios e ambiente de trabalho.",
            },
            {
                question: "Como funciona a plataforma?",
                answer: "Os usuários podem pesquisar empresas, ler avaliações de outros funcionários, compartilhar suas próprias experiências e comparar informações salariais. Tudo de forma anônima e segura.",
            },
            {
                question: "A Serel é gratuita?",
                answer: "Sim! A Serel é completamente gratuita para todos os usuários. Você pode navegar, ler avaliações e compartilhar suas experiências sem nenhum custo.",
            },
            {
                question: "Como posso entrar em contato com o suporte?",
                answer: "Você pode entrar em contato conosco através da página de Contacto ou enviando um email para suporte@serel.com. Nossa equipe responde em até 24 horas.",
            },
        ],
    },
    {
        category: "Conta e Privacidade",
        questions: [
            {
                question: "Preciso criar uma conta para usar a Serel?",
                answer: "Para visualizar avaliações, não é necessário criar conta. Porém, para avaliar empresas e acessar recursos completos, você precisa se registrar gratuitamente.",
            },
            {
                question: "Minhas avaliações são realmente anônimas?",
                answer: "Sim! Garantimos total anonimato. Suas avaliações não são vinculadas publicamente ao seu perfil e não compartilhamos informações pessoais com as empresas avaliadas.",
            },
            {
                question: "Como vocês protegem meus dados pessoais?",
                answer: "Seguimos rigorosos protocolos de segurança e privacidade. Seus dados são criptografados e nunca compartilhados com terceiros sem seu consentimento explícito.",
            },
            {
                question: "Posso excluir minha conta?",
                answer: "Sim, você pode solicitar a exclusão da sua conta a qualquer momento através das configurações do perfil ou entrando em contato com nosso suporte.",
            },
        ],
    },
    {
        category: "Avaliações",
        questions: [
            {
                question: "Como posso avaliar uma empresa?",
                answer: "Após fazer login, clique em 'Avaliar Empresa', pesquise pela empresa desejada e preencha o formulário com sua experiência, incluindo avaliação geral, salário e comentários sobre o ambiente de trabalho.",
            },
            {
                question: "Posso avaliar mais de uma empresa?",
                answer: "Sim! Você pode avaliar todas as empresas onde trabalhou ou trabalha atualmente. Cada avaliação contribui para uma base de dados mais rica e útil.",
            },
            {
                question:
                    "Como vocês verificam se as avaliações são verdadeiras?",
                answer: "Utilizamos algoritmos avançados e moderação manual para detectar avaliações falsas. Também verificamos padrões suspeitos e removemos conteúdo que não atende aos nossos padrões de qualidade.",
            },
            {
                question: "Posso editar ou excluir minha avaliação?",
                answer: "Sim, você pode editar ou excluir suas avaliações através do seu painel de usuário. As alterações passam por uma nova verificação antes de serem publicadas.",
            },
            {
                question: "Por que minha avaliação não apareceu imediatamente?",
                answer: "Todas as avaliações passam por um processo de moderação que pode levar até 48 horas. Isso garante a qualidade e veracidade do conteúdo na plataforma.",
            },
        ],
    },
    {
        category: "Empresas",
        questions: [
            {
                question: "Como posso encontrar uma empresa específica?",
                answer: "Use a barra de pesquisa na página inicial ou na seção de filtros. Você pode pesquisar por nome da empresa, setor ou localização.",
            },
            {
                question: "E se a empresa onde trabalho não estiver listada?",
                answer: "Você pode adicionar uma nova empresa durante o processo de avaliação. Basta inserir as informações básicas da empresa e ela será adicionada ao nosso banco de dados.",
            },
            {
                question: "As empresas podem responder às avaliações?",
                answer: "Atualmente, as empresas não podem responder diretamente às avaliações para manter o anonimato dos avaliadores. Porém, estamos desenvolvendo recursos para comunicação indireta.",
            },
            {
                question:
                    "Como são calculadas as avaliações médias das empresas?",
                answer: "As avaliações médias são calculadas com base em todas as avaliações verificadas da empresa, considerando diferentes critérios como ambiente de trabalho, salário, benefícios e satisfação geral.",
            },
        ],
    },
    {
        category: "Salários",
        questions: [
            {
                question: "As informações salariais são confiáveis?",
                answer: "Sim! As informações salariais são fornecidas por funcionários reais e passam por verificação. Mostramos faixas salariais baseadas em múltiplas avaliações para maior precisão.",
            },
            {
                question:
                    "Por que alguns salários aparecem como 'faixa' em vez de valor exato?",
                answer: "Para proteger a privacidade dos avaliadores e fornecer informações mais representativas, agrupamos salários similares em faixas salariais quando há dados suficientes.",
            },
            {
                question: "Posso comparar salários entre empresas?",
                answer: "Sim! Nossa plataforma permite comparar informações salariais entre diferentes empresas para o mesmo cargo ou área de atuação.",
            },
        ],
    },
    {
        category: "Problemas Técnicos",
        questions: [
            {
                question: "Estou com problemas para fazer login, o que fazer?",
                answer: "Verifique se está usando o email correto e tente redefinir sua senha. Se o problema persistir, entre em contato com nosso suporte técnico.",
            },
            {
                question: "A página não está carregando corretamente",
                answer: "Tente limpar o cache do navegador, desabilitar extensões temporariamente ou usar outro navegador. Se o problema continuar, nos informe.",
            },
            {
                question: "Posso usar a Serel no celular?",
                answer: "Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em dispositivos móveis através do navegador.",
            },
            {
                question: "Há um aplicativo móvel disponível?",
                answer: "Atualmente não temos um app nativo, mas estamos desenvolvendo um. Por enquanto, recomendamos usar nosso site otimizado para mobile.",
            },
        ],
    },
]);

const searchQuery = ref("");
const filteredFaqs = ref(faqs.value);

const filterFaqs = () => {
    if (!searchQuery.value.trim()) {
        filteredFaqs.value = faqs.value;
        // Fechar todas as categorias quando limpar pesquisa
        openCategories.value.clear();
        openCategories.value.add(0); // Manter primeira categoria aberta
        return;
    }

    const query = searchQuery.value.toLowerCase();
    filteredFaqs.value = faqs.value
        .map((category) => ({
            ...category,
            questions: category.questions.filter(
                (faq) =>
                    faq.question.toLowerCase().includes(query) ||
                    faq.answer.toLowerCase().includes(query),
            ),
        }))
        .filter((category) => category.questions.length > 0);

    // Abrir todas as categorias que têm resultados da pesquisa
    openCategories.value.clear();
    filteredFaqs.value.forEach((_, index) => {
        openCategories.value.add(index);
    });
};

function handleInput() {
    filterFaqs();
}
</script>

<template>
    <MainLayout>
        <!-- Hero Section -->
        <div
            class="w-full md:h-[500px] bg-[#F8FAFB] shadow flex items-center py-10"
        >
            <div class="w-full px-[12%]">
                <div class="flex items-center gap-[64px] justify-between">
                    <div class="flex-1 text-center">
                        <button
                            class="xs:text-sm cursor-default border p-2 mb-3 rounded-lg shadow-sm flex items-center justify-center mx-auto gap-2"
                        >
                            <i
                                class="bx bx-help-circle text-xl 3xl:text-2xl text-[#003F72]"
                            ></i>
                            Perguntas mais frequentes
                        </button>
                        <h1
                            class="text-3xl mb-2.5 font-bold sm:text-4xl 2xl:text-5xl max-w-xl mx-auto text-[#2D2D2D]"
                        >
                            Encontre respostas para suas dúvidas!
                        </h1>
                        <p
                            class="hidden sm:block text-xl md:text-2xl max-w-[800px] mx-auto"
                        >
                            Tire suas dúvidas sobre a plataforma, avaliações e
                            muito mais.
                        </p>
                    </div>
                </div>
                <div class="max-w-[800px] mx-auto">
                    <form @submit.prevent="handleInput" class="mt-5 flex">
                        <div class="relative w-full">
                            <input
                                type="text"
                                v-model="searchQuery"
                                @input="filterFaqs"
                                placeholder="Pesquisar perguntas..."
                                class="w-full bg-gray-100 text-gray-800 border-2 rounded-lg px-4 py-4 focus:ring-2 focus:ring-[#003F72] focus:outline-none placeholder:text-gray-500 placeholder:xs:text-sm"
                            />
                            <button
                                type="submit"
                                class="absolute flex items-center gap-1 right-2 top-1/2 transform -translate-y-1/2 bg-[#003F72] hover:bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
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

        <!-- FAQ Content -->
        <div class="w-full bg-white py-16">
            <div class="px-[8%] max-w-6xl mx-auto">
                <!-- No Results Message -->
                <div v-if="filteredFaqs.length === 0" class="text-center py-12">
                    <i
                        class="bx bx-search-alt-2 text-6xl text-gray-300 mb-4"
                    ></i>
                    <h3 class="text-2xl font-bold text-gray-600 mb-2">
                        Nenhum resultado encontrado
                    </h3>
                    <p class="text-gray-500 mb-6">
                        Tente pesquisar com outras palavras-chave ou navegue
                        pelas categorias abaixo.
                    </p>
                </div>

                <!-- FAQ Categories -->
                <div v-else class="space-y-6">
                    <div
                        v-for="(category, categoryIndex) in filteredFaqs"
                        :key="category.category"
                        class="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                        <button
                            @click="toggleCategory(categoryIndex)"
                            class="w-full px-6 py-6 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center group border-b border-gray-200"
                        >
                            <h2
                                class="text-xl md:text-2xl font-bold text-[#2D2D2D] group-hover:text-[#003F72] transition-colors"
                            >
                                {{ category.category }}
                            </h2>
                            <i
                                :class="[
                                    'bx text-3xl text-[#003F72] transition-transform duration-300 flex-shrink-0',
                                    openCategories.has(categoryIndex)
                                        ? 'bx-chevron-up'
                                        : 'bx-chevron-down',
                                ]"
                            ></i>
                        </button>

                        <div
                            :class="[
                                'transition-all duration-300 overflow-hidden',
                                openCategories.has(categoryIndex)
                                    ? 'max-h-[2000px] opacity-100'
                                    : 'max-h-0 opacity-0',
                            ]"
                        >
                            <div class="p-6 space-y-2">
                                <div
                                    v-for="(faq, index) in category.questions"
                                    :key="`${categoryIndex}-${index}`"
                                    class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
                                >
                                    <button
                                        @click="
                                            toggleAccordion(
                                                categoryIndex * 100 + index,
                                            )
                                        "
                                        class="w-full px-6 py-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center group"
                                    >
                                        <h3
                                            class="text-lg font-semibold text-[#2D2D2D] group-hover:text-[#003F72] transition-colors pr-4"
                                        >
                                            {{ faq.question }}
                                        </h3>
                                        <i
                                            :class="[
                                                'bx text-2xl text-[#003F72] transition-transform duration-300 flex-shrink-0',
                                                activeAccordion ===
                                                categoryIndex * 100 + index
                                                    ? 'bx-chevron-up'
                                                    : 'bx-chevron-down',
                                            ]"
                                        ></i>
                                    </button>

                                    <div
                                        :class="[
                                            'overflow-hidden transition-all duration-300',
                                            activeAccordion ===
                                            categoryIndex * 100 + index
                                                ? 'max-h-96 opacity-100'
                                                : 'max-h-0 opacity-0',
                                        ]"
                                    >
                                        <div
                                            class="px-6 py-5 bg-white border-t border-gray-100"
                                        >
                                            <p
                                                class="text-gray-700 leading-relaxed"
                                            >
                                                {{ faq.answer }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Section -->
        <div class="w-full bg-[#F8FAFB] py-16">
            <div class="px-[8%] max-w-4xl mx-auto text-center">
                <div class="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
                    <i
                        class="bx bx-help-circle text-5xl text-[#003F72] mb-6"
                    ></i>
                    <h2 class="text-3xl font-bold text-[#2D2D2D] mb-4">
                        Não encontrou o que procurava?
                    </h2>
                    <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Nossa equipe de suporte está sempre pronta para ajudar.
                        Entre em contato conosco e responderemos sua dúvida em
                        até 24 horas.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            class="px-8 py-4 bg-[#003F72] text-white rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 inline-flex items-center justify-center gap-2"
                        >
                            <i class="bx bx-envelope text-xl"></i>
                            Entrar em Contacto
                        </a>
                        <a
                            href="mailto:suporte@serel.com"
                            class="px-8 py-4 border-2 border-[#003F72] text-[#003F72] rounded-lg font-bold text-lg hover:bg-[#003F72] hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2"
                        >
                            <i class="bx bx-mail-send text-xl"></i>
                            suporte@serel.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>
<style scoped>
/* Custom accordion animation */
.max-h-0 {
    max-height: 0;
}

.max-h-96 {
    max-height: 24rem;
}

/* Smooth gradient backgrounds */
.bg-gradient-to-r {
    background: linear-gradient(135deg, #003f72 0%, #0056a3 100%);
}

.bg-gradient-to-br {
    background: linear-gradient(
        135deg,
        var(--tw-gradient-from),
        var(--tw-gradient-to)
    );
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
}

/* Smooth scrolling */
html {
    scroll-behavior: smooth;
}

/* Custom focus styles for better accessibility */
input:focus {
    box-shadow: 0 0 0 3px rgba(0, 63, 114, 0.1);
}

button:focus {
    outline: 2px solid #003f72;
    outline-offset: 2px;
}

/* Animation for FAQ items */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hover\:-translate-y-1:hover {
    transform: translateY(-0.25rem);
}
</style>
