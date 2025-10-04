<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type {isRecommendReviewResponse as isRecommendReviewResponseInterface, Review} from "@/types/Review";
import type { Company } from "@/types/Company";
import formatDate from "@/utils/formatDate";
import { useReviewStore } from "@/stores/reviews";
import { useUserStore } from "@/stores/users";
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import {useClipboard} from "@vueuse/core";
import ModalComponent from "@/components/ModalComponent.vue";
import ModalAuth from "@/components/auth/ModalAuth.vue";
import {useToast} from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";

const props = defineProps<{ review: Review; currentCompany: Company }>();
const reviewStore = useReviewStore();
const userStore = useUserStore();
const isLoadingUseFulReview = ref(false);
const userId = userStore.getUser()?.id;
const isUserUseFulReview = ref(true);

const localReview = reactive({ ...props.review });
const recommendResponse = reactive<isRecommendReviewResponseInterface>({
    reviewId: props.review.id,
    userId: userId,
    isRecommend: false
});
const { copy, copied } = useClipboard();
const showModalUser = ref(false);

// Modal de compartilhamento
const isShareModalOpen = ref(false);

const isExpandedPositiveComment = ref(false);
const isExpandedNegativeComment = ref(false);
const toast = useToast();
const filledStars = computed<number>(() => Math.floor(localReview.score ?? 0));
const hasHalfStar = computed<boolean>(() => (localReview.score ?? 0) % 1 >= 0.5);
const emptyStars = computed<number>(() => 5 - filledStars.value - (hasHalfStar.value ? 1 : 0));

const getDay = computed(() => formatDate.getDay(localReview.createdAt));
const getMonth = computed(() => formatDate.getMonth(localReview.createdAt));
const getYear = computed(() => formatDate.getYear(localReview.createdAt));

const messageUseFulReview = computed(() => {
    if (recommendResponse.isRecommend === true && localReview.usefulRate.useful === 1) {
        return "Foi marcada como útil por apenas você";
    } else if (recommendResponse.isRecommend === true && localReview.usefulRate.useful > 1) {
        return "Foi marcada como útil por você e mais " +
            (localReview.usefulRate.useful - 1) + " " +
            ((localReview.usefulRate.useful - 1) > 1 ? "pessoas" : "pessoa");
    }
    return "Foi marcada como útil por " +
        localReview.usefulRate.useful + " " +
        (localReview.usefulRate.useful > 1 ? "pessoas" : "pessoa");
});


const truncatedNegativeComment = computed(() => {
  const comment = localReview.comment?.negativeAspects || "";
  if (isExpandedNegativeComment.value || comment.length <= 320) return comment;
  return comment.slice(0, 320) + "...";
});

const truncatedPositiveComment = computed(() => {
  const comment = localReview.comment?.positiveAspects || "";
  if (isExpandedPositiveComment.value || comment.length <= 320) return comment;
  return comment.slice(0, 320) + "...";
});

const toggleReadMoreNegativeComment = () => {
  isExpandedNegativeComment.value = !isExpandedNegativeComment.value;
};

const toggleReadMorePositiveComment = () => {
  isExpandedPositiveComment.value = !isExpandedPositiveComment.value;
};

const handleUsefulReview = async (isRecommend: boolean) => {
  try {
    if(userStore.isLogged()){
      isLoadingUseFulReview.value = true;
      const response = await reviewStore.usefulReview({
        reviewId: localReview.id,
        userId: userId,
        isRecommend: isRecommend,
      });
      if (response.success) {
        localReview.usefulRate.useful = response.data.usefulRate?.useful || localReview.usefulRate.useful + (isRecommend ? 1 : 0);
        isUserUseFulReview.value = true;
      }
    }else{
      showModalUser.value = true;
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoadingUseFulReview.value = false;
  }
};

const fetchReview = async () => {
  try {
    isLoadingUseFulReview.value = true;
    const response = await reviewStore.getfulReview({
      reviewId: localReview.id,
      userId: userId,
    });
    if (!response.data) {
      isUserUseFulReview.value = false;
    }else{
        Object.assign(recommendResponse, response.data);
    }
  } catch (e) {
    console.log(e);
  } finally {
    isLoadingUseFulReview.value = false;
  }
};

// Funções de compartilhamento
const getReviewLink = () => {
  return `${window.location.origin}/overview/review/details/${props.review.id}`;
};

const getShareText = () => {
  return `Confira esta avaliação da empresa ${props.currentCompany.name}: "${localReview.reviewTitle}" - ${localReview.score}/5 estrelas`;
};

const openShareModal = () => {
  isShareModalOpen.value = true;
};

const closeShareModal = () => {
  setTimeout(()=>{
    isShareModalOpen.value = false;
  },1000);
};

const copyLink = (message : string = "Link copiado com sucesso!") => {
  const link = getReviewLink();
  copy(link);
  toast.success( message, {
    duration: 3000,
    position: "top-left",
  });
  closeShareModal();
};

const shareOnFacebook = () => {
  const url = encodeURIComponent(getReviewLink());
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  closeShareModal();
};

const shareOnTwitter = () => {
  const text = encodeURIComponent(getShareText());
  const url = encodeURIComponent(getReviewLink());
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  closeShareModal();
};

const shareOnWhatsApp = () => {
  const text = encodeURIComponent(`${getShareText()} ${getReviewLink()}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
  closeShareModal();
};

const shareOnInstagram = () => {
  copyLink("Link copiado! Cole no Instagram Stories ou em uma publicação.");
};

const shareOnLinkedin = () => {
  const url = encodeURIComponent(getReviewLink());
  const text = encodeURIComponent(getShareText());
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`, '_blank');
  closeShareModal();
};

onMounted(async () => {
  await fetchReview();
});
</script>

<template>
  <div class="w-full mt-8 flex md:flex-row flex-col gap-8 border-b-[3px] pb-10 border-[#E4E2E0]">
    <div class="">
      <span class="font-bold text-2xl dark:text-white">{{ localReview.score }},0</span>
      <div class="flex mt-2">
        <i v-for="n in filledStars" :key="'filled-' + n" class="bx bxs-star text-2xl text-[#003F72]"></i>
        <i v-if="hasHalfStar" class="bx bxs-star-half text-[#003F72] text-2xl"></i>
        <i v-for="n in emptyStars" :key="'empty-' + n" class="bx bx-star text-2xl text-[#003F72]"></i>
      </div>
    </div>
    <div class="flex-1">
      <div class="pb-5">
        <h2 class="text-2xl pr-2 font-bold dark:text-white">{{ localReview.reviewTitle }}</h2>
        <div class="my-1">
          <span class="text-[#767676] underline md:text-normal text-sm mr-1 dark:text-gray-300"> {{ localReview.jobTitle }} </span>
          <span class="text-[#767676] dark:text-gray-300"> {{ localReview.employeeType === 'Ex-employee' ? ' (Ex-Funcionário) ' : ' (Funcionário actual) ' }} </span>
          <span class="text-md text-[#767676] dark:text-gray-300"> em {{ getDay }} de {{ getMonth }} de {{ getYear }} </span>
        </div>
        <h3 class="mt-3 text-[#767676] md:pr-0 pr-2 dark:text-gray-300">{{ localReview.comment?.comment }}</h3>
      </div>
      <div class="border-t-2 border-[#E4E2E0] py-3">
        <h3 class="font-bold text-[#595959] dark:text-white">Recomendaria?</h3>
        <span class="dark:text-gray-300">{{ localReview.recommend ? 'Sim' : 'Não' }}.</span>
      </div>
      <div>
        <h3 class="font-bold text-[#595959] dark:text-white">Aspectos negativos:</h3>
        <span class="md:pr-0 pr-4 dark:text-gray-300">{{ truncatedNegativeComment }}
            <span v-if="localReview.comment?.negativeAspects.length > 320" @click="toggleReadMoreNegativeComment"
                  class="text-[#003f72] underline cursor-pointer dark:text-blue-500">
              {{ isExpandedNegativeComment ? "mostrar menos" : "saiba mais..." }}
            </span>
        </span>
      </div>
      <div class="my-5">
        <h3 class="text-[#595959] font-bold dark:text-white">Aspectos positivos:</h3>
        <span class="md:pr-0 pr-4 dark:text-gray-300">{{ truncatedPositiveComment }}
            <span v-if="localReview.comment?.positiveAspects.length > 320" @click="toggleReadMorePositiveComment"
                  class="text-[#003f72] underline cursor-pointer dark:text-blue-500">
              {{ isExpandedPositiveComment ? "mostrar menos" : "saiba mais..." }}
            </span>
        </span>
      </div>
      <div class="">
        <div v-if="isLoadingUseFulReview">
          <SpinnerComponent class="w-6 h-6"></SpinnerComponent>
        </div>
        <div v-else class="">
          <div v-if="localReview.usefulRate && localReview.usefulRate.useful > 0" class="flex flex-wrap justify-between mb-3">
            <h1 class="text-md text-[#767676] dark:text-gray-300">{{messageUseFulReview}}</h1>
            <button @click="openShareModal" type="button" class="flex gap-2 items-center mr-4 hover:text-[#003f72] transition-colors dark:text-gray-300">
              <img class="w-5 h-5" src="@/assets/img/share.svg" alt="Ícone de compartilhamento">
              Compartilhar
            </button>
          </div>
          <div v-if="!isUserUseFulReview" class="bg-gray-50 p-4 rounded-lg mt-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span class="text-[#595959] font-medium dark:text-white">Esta avaliação foi útil?</span>
              <button
                v-if="localReview.usefulRate.useful === 0"
                type="button"
                @click="openShareModal"
                class="flex gap-2 items-center sm:ml-auto text-[#003f72] hover:text-[#002a4d] transition-colors self-end sm:self-auto"
              >
                <img
                  class="w-5 h-5"
                  src="@/assets/img/share.svg"
                  alt="Ícone de compartilhamento"
                />
                <span class="dark:text-gray-300">Compartilhar</span>
              </button>
            </div>

            <div class="mt-4 flex justify-center sm:justify-start gap-3">
              <button
                @click="handleUsefulReview(true)"
                class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#F3F2F1] text-[#595959] hover:bg-[#003f72] hover:text-white transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#003f72] focus:ring-opacity-50"
              >
                <i class="bx bx-like mr-1.5 dark:text-gray-300"></i>Sim
              </button>
              <button
                @click="handleUsefulReview(false)"
                class="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#F3F2F1] text-[#595959] hover:bg-[#003f72] hover:text-white transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#003f72] focus:ring-opacity-50"
              >
                <i class="bx bx-dislike mr-1.5 dark:text-gray-300"></i>Não
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal de Compartilhamento -->
  <ModalComponent 
    :is-open="isShareModalOpen" 
    @close="closeShareModal"
    title="Compartilhar Avaliação"
    maxWidth="md"
  >
    <div class="p-6">
      <div class="bg-blue-50 p-4 rounded-lg mb-6 flex items-center gap-3">
        <div class="flex-shrink-0">
          <i class="bx bxs-quote-alt-left text-2xl text-[#003F72]"></i>
        </div>
        <p class="text-sm text-gray-700">{{ getShareText() }}</p>
      </div>

      <h4 class="text-sm font-medium text-gray-700 mb-3">Compartilhar em redes sociais</h4>
      <div class="grid grid-cols-5 gap-3 mb-6">
        <!-- Facebook -->
        <button
          @click="shareOnFacebook"
          class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[#1877F2] transition-colors"
          title="Compartilhar no Facebook"
        >
          <i class="bx bxl-facebook text-2xl"></i>
          <span class="text-xs text-gray-600">Facebook</span>
        </button>

        <!-- Twitter -->
        <button
          @click="shareOnTwitter"
          class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[#1DA1F2] transition-colors"
          title="Compartilhar no Twitter"
        >
          <i class="bx bxl-twitter text-2xl"></i>
          <span class="text-xs text-gray-600">Twitter</span>
        </button>

        <!-- WhatsApp -->
        <button
          @click="shareOnWhatsApp"
          class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[#25D366] transition-colors"
          title="Compartilhar no WhatsApp"
        >
          <i class="bx bxl-whatsapp text-2xl"></i>
          <span class="text-xs text-gray-600">WhatsApp</span>
        </button>

        <!-- Instagram -->
        <button
          @click="shareOnInstagram"
          class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[#E4405F] transition-colors"
          title="Compartilhar no Instagram"
        >
          <i class="bx bxl-instagram text-2xl"></i>
          <span class="text-xs text-gray-600">Instagram</span>
        </button>

        <!-- LinkedIn -->
        <button
          @click="shareOnLinkedin"
          class="flex flex-col items-center gap-2 p-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-[#0A66C2] transition-colors"
          title="Compartilhar no LinkedIn"
        >
          <i class="bx bxl-linkedin text-2xl"></i>
          <span class="text-xs text-gray-600">LinkedIn</span>
        </button>
      </div>

      <!-- Copiar Link -->
      <div class="mt-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">Ou copie o link</h4>
        <div class="flex gap-2">
          <input 
            type="text" 
            readonly 
            :value="getReviewLink()" 
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            type="button"
            @click="() => copyLink()"
            class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#003F72] hover:bg-[#002a4d] text-white transition-colors"
          >
            <i class="bx bx-copy text-xl"></i>
            <span class="font-medium">Copiar</span>
          </button>
        </div>
      </div>
    </div>
  </ModalComponent>
  <ModalAuth :modal-value="showModalUser" @close="showModalUser=false;"></ModalAuth>
  <ToastContainer/>
</template>
<style scoped></style>