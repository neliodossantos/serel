<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import {useCompanyStore} from "@/stores/companies";
import {validators} from "@/utils/validators/validators";
import {useToast} from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import DatePickerComponent from "@/components/datepicker/DatePickerComponent.vue";
import formatDate from "@/utils/formatDate";
import {useUploadStore} from "@/stores/upload";


const emit = defineEmits(['toggleSuccessRequest']);
const toast = useToast();
const isLoading = ref(false);
const companyStore = useCompanyStore();
const selectedStartDate = ref<Date | null>(null)
const file = ref<File | null>(null);
const  uploadStore = useUploadStore();

const onStartDateSelect = (date: Date) => {
  company.foundedIn = formatDate.getDate(date);
}

const company = reactive({
  name: '',
  address: {
    city: '',
    country: ''
  },
  nif: '',
  sector: '',
  foundedIn: '',
  phone:  '',
  email : '',
  logo : '' as string | null,
  size: {
    min: null,
    max: null
  },
  website: '',
  description: '',
});

const errors = reactive({
  name: { message : '' , valid : true },
  city: { message : '' , valid : true },
  country: { message : '' , valid : true },
  nif : { message : '' , valid : true },
  sector: { message : '' , valid : true },
  foundedIn: { message : '' , valid : true },
  phone: { message : '' , valid : true },
  email: { message : '' , valid : true },
  logo: { message : '' , valid : true },
  min: { message : '' , valid : true },
  max : { message : '' , valid : true } ,
  website: { message : '' , valid : true },
  description : {message : '' , valid: true }
});


watch(() => company.name, () => { errors.name = validators.validateCompanyName(company.name); },{ deep: true});
watch(() => company.address.city, () => {  errors.city = validators.validateField(company.address.city,'Cidade'); },{ deep: true});
watch(() => company.address.country, () => { errors.country = validators.validateField(company.address.country, 'Páis');},{ deep: true});
watch(() => company.nif, () => { errors.nif = validators.validateNIF(company.nif) },{ deep: true});
watch(() => company.sector , () => { errors.sector = validators.validateField(company.sector,'Sector')} , {deep: true});
watch(() => company.foundedIn , () => { errors.foundedIn = validators.validateField(company.foundedIn,'Data de Fundação')} , {deep: true});
watch(() => company.phone , () => {  errors.phone = validators.validatePhone(company.phone); } , {deep: true} );
watch(() => company.email , () => {  errors.email = validators.validateEmail(company.email); } , {deep: true} );
watch(() => company.logo , () => {  errors.logo = validators.validateField(company.logo, 'Logo'); } , {deep: true} );
watch(() => company.size.min , () => { errors.min = validators.validateField(company.size.min, 'Tamanho Mínimo da Empresa') } , {deep: true} );
watch(() => company.size.max , () => { errors.max = validators.validateField(company.size.max, 'Tamanho Máximo da Empresa') } , {deep: true} );
watch(() => company.website , () => { errors.website = validators.validateField(company.website, 'Website') } , {deep: true} );
watch(() => company.description , () => { errors.description = validators.validateField(company.description, 'Descrição') } , {deep: true} );

const validateForm = () => {
  errors.name = validators.validateField(company.name, 'Nome da Empresa');
  errors.city = validators.validateField(company.address.city,'Cidade ');
  errors.country = validators.validateField(company.address.country, 'Páis');
  errors.nif = validators.validateField(company.nif, 'Número de Identificação Fiscal');
  errors.sector = validators.validateField(company.sector,'Sector');
  errors.foundedIn = validators.validateField(company.foundedIn,'Comentário');
  errors.phone = validators.validateField(company.phone, 'Número de Telefone');
  errors.email = validators.validateEmail(company.email, );
  errors.logo = validators.validateField(company.logo, 'Logo');
  errors.min = validators.validateField(company.size.min, 'Tamanho Mínimo da Empresa');
  errors.max = validators.validateField(company.website, 'Tamanho Máximo da Empresa');
  errors.website = validators.validateField(company.website, 'Website');
  errors.description = validators.validateField(company.description, 'Descrição');
}

const handleSubmit = async () => {
  try {
    emit('toggleSuccessRequest',true);
  }catch (e) {
    toast.error("Ocorreu um erro!");
  }finally {
    isLoading.value = false;
  }
}
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <div class="py-5">
      <h2 class="md:text-2xl max-w-[800px] text-lg mb-6">Informe as informações da empresa onde trabalhas ou trabalhavas</h2>
      <div @submit.prevent="handleSubmit" class="md:rounded-lg md:border-2 md:border-[#C3C6E5] flex flex-col gap-12 md:px-8 md:py-10">
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Nome</h3>
          <input v-model="company.name" placeholder="Digite o nome..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.name.valid">{{errors.name.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Número de identificação fiscal</h3>
          <input v-model="company.nif" placeholder="Digite o nif da empresa..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.nif.valid">{{errors.nif.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Endereço</h3>
          <div class="flex justify-between gap-4">
            <div class="flex-1">
              <h3 class="font-bold text-md  mb-2">Cidade</h3>
              <input v-model="company.address.city" placeholder="Digite a cidade..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
              <span class="text-red-400 mt-1" v-if="!errors.city.valid">{{errors.city.message}}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-md mb-2">Páis</h3>
              <input v-model="company.address.country" placeholder="Digite o país..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
              <span class="text-red-400 mt-1" v-if="!errors.country.valid">{{errors.country.message}}</span>
            </div>
          </div>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Sector</h3>
          <input v-model="company.sector" placeholder="Digite o sector..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.sector.valid">{{errors.sector.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Email</h3>
          <input v-model="company.email" placeholder="Digite o email..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.email.valid">{{errors.email.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Numero de Telefone</h3>
          <input v-model="company.phone" placeholder="Digite o numero de telefone..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.phone.valid">{{errors.phone.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Fundada em</h3>
          <div class="w-full relative">
            <DatePickerComponent v-model="selectedStartDate" placeholder="Data de Fundação" @date-select="onStartDateSelect"/>
            <div class="absolute right-3 bottom-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-[#D4D2D0] font-bold">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.foundedIn.valid">{{errors.foundedIn.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Tamanho da Empresa</h3>
          <div class="flex flex-wrap justify-between gap-4">
            <div class="flex-1">
              <h3 class="font-bold text-md mb-2">Mínimo</h3>
              <input v-model="company.size.min" placeholder="Digite o mínimo..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
              <span class="text-red-400 mt-1" v-if="!errors.min.valid">{{errors.min.message}}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-md mb-2">Máximo</h3>
              <input v-model="company.size.max" placeholder="Digite o máximo..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
              <span class="text-red-400 mt-1" v-if="!errors.max.valid">{{errors.max.message}}</span>
            </div>
          </div>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">WebSite</h3>
          <input v-model="company.website" placeholder="Digite o website..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.website.valid">{{errors.website.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Descrição</h3>
          <textarea v-model="company.description" placeholder="Escreva sua avaliação detalhada aqui..." class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent" />
          <span class="text-red-400 mt-1" v-if="!errors.description.valid">{{errors.description.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2">Logo</h3>
          <input type="file" accept="image/*" @change="(event) => { file = (event.target as HTMLInputElement).files?.[0] || null; company.logo = file?.name || null }" class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent">
          <span class="text-red-400 mt-1" v-if="!errors.logo.valid">{{errors.logo.message}}</span>
        </div>
        <div class="mt-6 w-full">
          <button type="submit" class="flex items-center gap-3 justify-center mt-3 bg-[#003F72] text-white w-full py-[10px] px-[20px] rounded-md font-bold" :class="{'disable' : isLoading }" :disabled="isLoading">
            {{ isLoading ? 'Processando...' : 'Confirmar'}}
            <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500 border-solid"></div>
          </button>
        </div>
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