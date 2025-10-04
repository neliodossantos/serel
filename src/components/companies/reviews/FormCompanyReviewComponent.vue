<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import type {Company} from "@/types/Company";
import {useCompanyStore} from "@/stores/companies";
import {validators} from "@/utils/validators/validators";
import DatePickerComponent from "@/components/datepicker/DatePickerComponent.vue";
import {useUserStore} from "@/stores/users";
import {useReviewStore} from "@/stores/reviews";
import {useToast} from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import type {DecodeUser} from "@/types/DecodeUser";
import formatDate from "@/utils/formatDate";
import router from "@/router";


const toast = useToast();
const emit = defineEmits(['toggleSuccessRequest']);
const props = defineProps<{ currentCompany: Company;}>();
const ratingOptions = ref([1,2,3,4,5]);
const isLoading = ref(false);
const reviewStore = useReviewStore();
const userStore = useUserStore();
const currentUser = <DecodeUser>userStore.getUser();
const selectedStartDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)
const starSaved = ref(localStorage.getItem('star'));


const review = reactive({
  companyId: props.currentCompany.id,
  userId: currentUser.id,
  score: 0,
  recommend : null as boolean | null,
  employeeType: '',
  jobTitle: '',
  reviewTitle: '',
  comment: {
    comment: '',
    positiveAspects: '',
    negativeAspects: ''
  },
  period: {
    from: '',
    to: ''
  }
});
const errors = reactive({
  userId: { message : '' , valid : true },
  score: { message : '' , valid : true },
  recommend : { message : '' , valid : true },
  employeeType: { message : '' , valid : true },
  jobTitle: { message : '' , valid : true },
  reviewTitle: { message : '' , valid : true },
  comment: { message : '' , valid : true },
  positiveAspects: { message : '' , valid : true },
  negativeAspects: { message : '' , valid : true },
  startDate : { message : '' , valid : true } ,
  endDate: { message : '' , valid : true },
  rangeDate : {message : '' , valid: true }
});

const onStartDateSelect = (date: Date) => {
  review.period.from = formatDate.getDate(date);
  if(review.employeeType === 'Employee'){
    review.period.to = formatDate.getDate(date);
    console.log(review.period.to);
  }
}
const onEndDateSelect = (date: Date) => {
  review.period.to = formatDate.getDate(date);
}

watch(() => review.score, () => {  errors.score = validators.validateRating(review.score); },{ deep: true});
watch(() => review.recommend, () => { errors.recommend = validators.validateTypeBoolean(review.recommend, 'Recomendaria a um amigo trabalhar nessa empresa ?');},{ deep: true});
watch(() => review.jobTitle, () => { errors.jobTitle = validators.validateField(review.jobTitle, 'Posição/Cargo na Empresa') },{ deep: true});
watch(() => review.reviewTitle , () => { errors.reviewTitle = validators.validateField(review.reviewTitle,'Título da Avaliação')} , {deep: true});
watch(() => review.comment.comment , () => { errors.comment = validators.validateField(review.comment.comment,'Comentário')} , {deep: true});
watch(() => review.comment.positiveAspects , () => {  errors.positiveAspects = validators.validateField(review.comment.positiveAspects, 'Aspectos positivos'); } , {deep: true} );
watch(() => review.comment.negativeAspects , () => {  errors.negativeAspects = validators.validateField(review.comment.negativeAspects, 'Aspectos negativos'); } , {deep: true} );
watch(() => review.employeeType , () => {  errors.employeeType = validators.validateField(review.employeeType, 'Ainda trabalha na empresa'); } , {deep: true} );
watch(() => review.period.from , () => { errors.startDate = validators.validateDate(review.period.from, 'Data de Inicio') } , {deep: true} );

const validateForm = () => {
  errors.score = validators.validateRating(review.score);
  errors.recommend = validators.validateTypeBoolean(review.recommend, 'Recomendaria a um amigo trabalhar nessa empresa ?');
  errors.jobTitle = validators.validateField(review.jobTitle, 'Posição/Cargo na Empresa')
  errors.reviewTitle = validators.validateField(review.reviewTitle,'Título da Avaliação')
  errors.comment = validators.validateField(review.comment.comment, 'Comentário');
  errors.positiveAspects = validators.validateField(review.comment.positiveAspects, 'Aspectos positivos');
  errors.negativeAspects = validators.validateField(review.comment.negativeAspects, 'Aspectos negativos');
  errors.employeeType = validators.validateField(review.employeeType, 'Ainda trabalha na empresa');
  errors.startDate = validators.validateDate(review.period.from, 'Data de Inicio');
  if(review.employeeType === 'Ex-employee'){
    errors.endDate = validators.validateDate(review.period.to, 'Data de Termino');
    if(review.period.from !== "" && review.period.to !== ""){
      errors.rangeDate = validators.validateDateRange(review.period.from,review.period.to);
    }
  }
}

function selectCompanyValuation(value: number) {
  review.score = value;
}
function selectIsRecommendedCompany(value: boolean) {
  review.recommend = value;
}
function selectIsWorkingCompany(value: string) {
  review.employeeType = value;
}
const handleSubmit = async () => {
  try {
    isLoading.value = true;
    validateForm();
    const success = Object.values(errors).every((error) => error.valid);
    if(!success) {
      toast.error('Preencha todos os campos');
      return;
    }
    const response = await reviewStore.createReview(review);
    if(starSaved.value){
      localStorage.removeItem('star');
    }
    if(response.success){
      emit('toggleSuccessRequest',true);
    }else{
      toast.error(response.message);
    }
  }catch (e) {
    toast.error("Ocorreu um erro!");
  }finally {
    isLoading.value = false;
  }
}

onMounted(()=>{
    if(localStorage.getItem('star')){
      const star : number = parseInt(localStorage.getItem('star') ?? '0' , 10);
      if(typeof star === 'number'){
        selectCompanyValuation(star);
        review.score = star;

      }
    }
});
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="sm:py-5">
      <h2 class="md:text-2xl max-w-[800px] text-lg mb-6 dark:text-gray-300">Compartilhe sua avaliação anônima sobre a empresa <span class="font-bold">{{currentCompany.name}}</span></h2>
      <div @submit.prevent="handleSubmit" class="md:rounded-lg md:border-2 md:border-[#C3C6E5] flex flex-col gap-12 md:px-8 md:py-10">
        <div class="">
          <h3 class="text-md sm:text-lg font-bold mb-3 dark:text-gray-300">Avaliação da empresa.</h3>
          <div class="flex justify-between w-full">
            <button v-if="starSaved" type="button" class="border border-[#D4D2D0] p-3 w-full"
                    v-for="value in ratingOptions" :key="value"
                    @click="selectCompanyValuation(value)"
                    :class="[ review.score === value ? 'bg-[#003F72] text-white' : 'bg-white text-[#003F72]' ,value === 1 ? 'rounded-l-md' : '' , value === 5 ? 'rounded-r-md' : '']">{{ value }}</button>
            <button v-else type="button" class="border border-[#D4D2D0] p-3 w-full"
                    v-for="value in ratingOptions"
                    @click="selectCompanyValuation(value)"
                    :class="[review.score === value ? 'bg-[#003F72] text-white' : 'bg-white text-[#003F72]' ,value === 1 ? 'rounded-l-md' : '' , value === 5 ? 'rounded-r-md' : '']">{{ value }}</button>
          </div>
          <div class="flex justify-between w-full text-[#767676] mt-2">
            <span class="font-medium dark:text-gray-300">Pessima</span>
            <span class="font-medium dark:text-gray-300">Excelente</span>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.score.valid">{{errors.score.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Recomendaria a um amigo trabalhar nessa empresa?</h3>
          <div class="flex justify-between w-full">
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-l-md"
                    @click="selectIsRecommendedCompany(true)" :class="[ true === review.recommend ? 'bg-[#003F72] text-white' : 'bg-white']">Sim</button>
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-r-md"
                    @click="selectIsRecommendedCompany(false)" :class="[ false === review.recommend ? 'bg-[#003F72] text-white' : 'bg-white']">Não</button>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.recommend.valid">{{errors.recommend.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Posição/Cargo na Empresa</h3>
          <input v-model="review.jobTitle" placeholder="Escreva..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.jobTitle.valid">{{errors.jobTitle.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Título da Avaliação</h3>
          <input v-model="review.reviewTitle" placeholder="Digite um titulo para sua avaliação..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.reviewTitle.valid">{{errors.reviewTitle.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Comentário</h3>
          <textarea v-model="review.comment.comment" placeholder="Escreva sua avaliação detalhada aqui..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent" />
          <span class="text-red-400 mt-1" v-if="!errors.comment.valid">{{errors.comment.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Aspectos positivos</h3>
          <textarea v-model="review.comment.positiveAspects" placeholder="Escreva..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent"/>
          <span class="text-red-400 mt-1" v-if="!errors.positiveAspects.valid">{{errors.positiveAspects.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Aspectos negativos</h3>
          <textarea v-model="review.comment.negativeAspects" placeholder="Escreva..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent"/>
          <span class="text-red-400 mt-1" v-if="!errors.negativeAspects.valid">{{errors.negativeAspects.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Ainda trabalha na empresa?</h3>
          <div class="flex justify-between w-full">
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-l-md"
                    @click="selectIsWorkingCompany('Employee')" :class="[ 'Employee' === review.employeeType ? 'bg-[#003F72] text-white' : 'bg-white']">Sim</button>
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-r-md"
                    @click="selectIsWorkingCompany('Ex-employee')" :class="[ 'Ex-employee' === review.employeeType ? 'bg-[#003F72] text-white' : 'bg-white']">Não</button>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.employeeType.valid">{{errors.employeeType.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Periodo na empresa</h3>
          <div class="flex md:flex-nowrap flex-wrap justify-between gap-8 w-full">
            <div class="w-full">
              <div class="w-full relative">
                <DatePickerComponent v-model="selectedStartDate" placeholder="Data de Inicio" @date-select="onStartDateSelect"/>
                <div class="absolute right-3 bottom-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-[#D4D2D0] font-bold">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
              </div>
              <span class="text-red-400 mt-1" v-if="!errors.startDate.valid">{{errors.startDate.message}}</span>
              <span class="text-red-400 mt-1" v-if="!errors.rangeDate.valid">{{errors.rangeDate.message}}</span>
            </div>
            <div class="w-full" v-if="review.employeeType === 'Ex-employee'">
              <div class="w-full relative">
                <DatePickerComponent v-model="selectedEndDate" placeholder="Data de Termino" @date-select="onEndDateSelect"/>
                <div class="absolute right-3 bottom-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-[#D4D2D0] font-bold">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
              </div>
              <span class="text-red-400 mt-1" v-if="!errors.endDate.valid">{{errors.endDate.message}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 w-full">
        <button type="submit" class="flex items-center gap-3 justify-center mt-3 bg-[#003F72] text-white w-full py-[10px] px-[20px] rounded-md font-bold" :class="{'disable' : isLoading }" :disabled="isLoading">
          {{ isLoading ? 'Processando...' : 'Confirmar'}}
          <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid"></div>
        </button>
      </div>
    </div>
  </form>
  <ToastContainer />
</template>
<style scoped>
.disable{
  background-color: #D1E9FF !important;
  color: #98A2B3;
}
</style>


