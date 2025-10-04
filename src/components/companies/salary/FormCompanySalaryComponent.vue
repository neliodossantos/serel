<script setup lang="ts">
import {onMounted, reactive, ref, watch} from "vue";
import type {Company} from "@/types/Company";
import type {Area} from "@/types/Area";
import type {Role} from "@/types/Role";
import {validators} from "@/utils/validators/validators";
import DatePickerComponent from "@/components/datepicker/DatePickerComponent.vue";
import {useUserStore} from "@/stores/users";
import {useSalaryStore} from "@/stores/salary";
import {useToast} from "@/composables/useToast";
import ToastContainer from "@/components/toast/ToastContainer.vue";
import type {DecodeUser} from "@/types/DecodeUser";
import formatDate from "@/utils/formatDate";
import {useAreaStore} from "@/stores/areas";
import SelectAreaComponent from "@/components/select/SelectAreaComponent.vue";
import {useRoleStore} from "@/stores/roles";
import SelectRoleComponent from "@/components/select/SelectRoleComponent.vue";
import {formatSalaryAmount} from "@/utils/formatCurrency";

const emit = defineEmits(['toggleSuccessRequest']);
const props = defineProps<{ currentCompany: Company;}>();
const toast = useToast();
const showCompanyInput = ref(false);
const areas = ref<Area[]>([])
const isLoading = ref(false);

const areaStore = useAreaStore();
const roleStore = useRoleStore();
const salaryStore = useSalaryStore();
const userStore = useUserStore();
const currentUser = <DecodeUser>userStore.getUser();

const selectedStartDate = ref<Date | null>(null)
const selectedEndDate = ref<Date | null>(null)
const positionLevels = ['Junior','Medium','Senior'];
const selectedRole  = ref<String | undefined>('');
const selectedArea  = ref<String | undefined>('');
const roles = ref<Role[]>([]);

const salary = reactive({
  companyId: props.currentCompany.id,
  userId: currentUser.id,
  positionRoleId: '' as string | undefined,
  positionLevel : '',
  employeeType: '',
  totalExperience: null,
  companyExperience: null,
  salaryAmount: 0 as number | null,
  satisfied: null as boolean | null,
  period: {
    from: '',
    to: ''
  }
});
const errors = reactive({
  companyId: { message : '' , valid : true },
  userId: { message : '' , valid : true },
  areaId: { message : '' , valid : true },
  positionRoleId: { message : '' , valid : true },
  positionLevel : { message : '' , valid : true },
  employeeType: { message : '' , valid : true },
  totalExperience: { message : '' , valid : true },
  companyExperience: { message : '' , valid : true },
  salaryAmount: { message : '' , valid : true },
  satisfied: { message : '' , valid : true },
  startDate : { message : '' , valid : true } ,
  endDate: { message : '' , valid : true },
  rangeDate : {message : '' , valid: true }
});

const onStartDateSelect = (date: Date) => {
  salary.period.from = formatDate.getDate(date);
  if(salary.employeeType === 'Employee'){
    salary.period.to = formatDate.getDate(date);
    console.log(salary.period.to);
  }
}
const onEndDateSelect = (date: Date) => {
  salary.period.to = formatDate.getDate(date);
}

watch(() => salary.companyId, () => { errors.companyId = validators.validateField(salary.companyId, 'Empresa'); },{ deep: true});
watch(() => selectedArea, () => {  errors.areaId = validators.validateField(selectedArea,'Sector'); },{ deep: true});
watch(() => salary.positionRoleId, () => {  errors.positionRoleId = validators.validateField(salary.positionRoleId,'Posição na Empresa'); },{ deep: true});
watch(() => salary.positionLevel, () => { errors.positionLevel = validators.validateField(salary.positionLevel, 'Nivel de Experiência') },{ deep: true});
watch(() => salary.companyExperience, () => { errors.companyExperience = validators.validateField(salary.companyExperience, 'Experiência na empresa') },{ deep: true});
watch(() => salary.totalExperience , () => { errors.totalExperience = validators.validateNumber(salary.totalExperience,'Total de Experiência') });
watch(() => salary.salaryAmount , () => { errors.salaryAmount = validators.validateNumber(salary.salaryAmount,'Valor Salárial')} , {deep: true});
watch(() => salary.satisfied , () => {  errors.satisfied = validators.validateField(salary.satisfied, 'Satisfação Salarial'); } , {deep: true} );
watch(() => salary.employeeType , () => {  errors.employeeType = validators.validateField(salary.employeeType, 'Ainda trabalha na empresa'); } , {deep: true} );
watch(() => salary.period.from , () => { errors.startDate = validators.validateDate(salary.period.from, 'Data de Inicio') } , {deep: true} );

const validateForm = () => {
  errors.companyId = validators.validateField(salary.companyId, 'Empresa');
  errors.areaId = validators.validateField(selectedArea.value, 'Sector');
  errors.positionRoleId = validators.validateField(salary.positionRoleId,'Posição na Empresa');
  errors.positionLevel = errors.positionLevel = validators.validateField(salary.positionLevel, 'Nivel de Experiência');
  errors.companyExperience = validators.validateField(salary.companyExperience, 'Experiência na empresa');
  errors.totalExperience = validators.validateNumber(salary.totalExperience,'Total de Experiência')
  errors.salaryAmount = validators.validateNumber(salary.salaryAmount, 'Valor Salarial');
  errors.satisfied = validators.validateField(salary.satisfied, 'Satisfação Salarial');
  errors.employeeType = validators.validateField(salary.employeeType, 'Ainda trabalha na empresa');
  errors.startDate = validators.validateDate(salary.period.from, 'Data de Inicio');
  if(salary.employeeType === 'Ex-employee'){
    errors.endDate = validators.validateDate(salary.period.to, 'Data de Termino');
    if(salary.period.from !== "" && salary.period.to !== ""){
      errors.rangeDate = validators.validateDateRange(salary.period.from,salary.period.to);
    }
  }
}

function selectLevelPosition(value: string) {
  salary.positionLevel = value;
}
function selectIsWorkingCompany(value: string) {
  salary.employeeType = value;
}

function selectSalarySatisfaction(value: boolean) {
  salary.satisfied = value;
}

onMounted(async () => {
  try {
    const responseArea = await areaStore.getAll({ filter: {}, page: 1, limit: 100 });
    areas.value = responseArea.data ?? [];
  }catch (e) {
    console.log(e);
  }
});

const handleSalaryInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  try {
    const rawValue = input.value.replace(/\D/g, '');
    const formattedValue = formatSalaryAmount(parseInt(rawValue));
    salary.salaryAmount = rawValue ? parseInt(rawValue) : null;
    input.value = formattedValue;
  } catch (error) {
    salary.salaryAmount = null;
    input.value = '';
  }
};

const fetchRole =  async (areaId: string | undefined) => {
  try {
    const response = await roleStore.getAll({ filter: { areaId: areaId } , page: 1, limit: 100 });
    roles.value = response.data ?? [];
    console.log(roles.value);
  }catch (e) {
    console.log(e);
  }
}

const handleSelectArea = async (area: Area | null) => {
  selectedArea.value = area?.id;
  if(selectedArea.value !== ''){
    await fetchRole(area?.id);
  }else{
    roles.value = [];
    salary.positionRoleId = '';
  }
}

const handleSelectRole = async (role: Role | null) => {
  salary.positionRoleId = role?.id;
}

const reportMissing = (value: boolean) => {
  showCompanyInput.value = value;
};

const clearAreaSelected = () => {
  selectedArea.value = '';
  roles.value = [];
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
    const response = await salaryStore.createSalary(salary);
    if(response.success){
      emit('toggleSuccessRequest',true);
    }else{
      toast.error(response.message);
    }
    console.log(salary);
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
      <h2 class="md:text-2xl max-w-[800px] text-lg mb-6 dark:text-gray-300">Compartilhe sua avaliação salarial anônima sobre a empresa <span class="font-bold">{{currentCompany.name}}</span></h2>
      <div @submit.prevent="handleSubmit" class="md:rounded-lg md:border-2 md:border-[#C3C6E5] flex flex-col gap-12 md:px-8 md:py-10">
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Nivel de Experiência</h3>
          <div class="flex justify-between w-full">
            <button type="button" class="border border-[#D4D2D0] p-3 w-full"
                    v-for="(value,index) in positionLevels" :key="index"
                    @click="selectLevelPosition(value)"
                    :class="[salary.positionLevel === value ? 'bg-[#003F72] text-white' : 'bg-white text-[#003F72]' , index === 0 ? 'rounded-l-md' : '' , index === 2 ? 'rounded-r-md' : '']">{{value === 'Junior' ? 'Júnior'
                    : value === 'Medium' ? 'Médio' : 'Sénior'}}
            </button>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.positionLevel.valid">{{errors.positionLevel.message}}</span>
        </div>
        <div class="">
          <h3 class="text-md sm:text-lg font-bold mb-3 dark:text-gray-300">Experiência na empresa.</h3>
          <div class="flex justify-between w-full">
            <input v-model="salary.companyExperience" type="number" placeholder="Digite os anos de experiencia na empresa" min="0" class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent"/>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.companyExperience.valid">{{errors.companyExperience.message}}</span>
        </div>
        <div>
          <h3 class="text-md sm:text-lg font-bold mb-3 dark:text-gray-300">Sector</h3>
          <SelectAreaComponent :items="areas" placeholder="Selecione a area..."
                               @select="handleSelectArea" @reportMissing="reportMissing" @clear="clearAreaSelected"/>
          <span class="text-red-400 mt-1" v-if="!errors.areaId.valid">{{errors.areaId.message}}</span>
        </div>
        <div>
          <h3 class="text-md sm:text-lg font-bold mb-3 dark:text-gray-300">Função</h3>
          <SelectRoleComponent :items="roles" placeholder="Selecione a função..."
                               @select="handleSelectRole" @reportMissing="reportMissing" @clear="value => selectedRole = ''"/>
          <span class="text-red-400 mt-1" v-if="!errors.positionRoleId.valid">{{errors.positionRoleId.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Total de Experiência</h3>
          <input v-model="salary.totalExperience" type="number" min="0" placeholder="Digite os anos de experiencia de carreira" class="w-full rounded-md border border-[#D4D2D0] p-3 focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent"/>
          <span class="text-red-400 mt-1" v-if="!errors.totalExperience.valid">{{errors.totalExperience.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Valor Salarial</h3>
          <div class="relative w-full">
            <input
                :value="salary.salaryAmount ? formatSalaryAmount(salary.salaryAmount) : ''"
                @input="handleSalaryInput" type="text"
                class="w-full rounded-md border border-[#D4D2D0] px-3 py-3 pr-20
                focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent"/>
            <div class="absolute h-full right-0 top-0">
              <div class="w-full h-full flex gap-1 items-center justify-between p-2 rounded-r-lg text-black
                         focus:outline-none outline-none  border border-[#D4D2D0] text-gray-900">
                <i class='bx bx-coin text-2xl text-gray-900'></i>AOA
              </div>
            </div>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.salaryAmount.valid">{{errors.salaryAmount.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Satisfeito com o salário? </h3>
          <div class="flex justify-between w-full">
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-l-md"
                    @click="selectSalarySatisfaction(false)" :class="[ false === salary.satisfied ? 'bg-[#003F72] text-white' : 'bg-white']">Sim</button>
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-r-md"
                    @click="selectSalarySatisfaction(true)" :class="[ true === salary.satisfied ? 'bg-[#003F72] text-white' : 'bg-white']">Não</button>
          </div>
          <span class="text-red-400 mt-1" v-if="!errors.satisfied.valid">{{errors.satisfied.message}}</span>
        </div>
        <div class="">
          <h3 class="font-bold text-md sm:text-lg mb-2 dark:text-gray-300">Ainda trabalha na empresa?</h3>
          <div class="flex justify-between w-full">
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-l-md"
                    @click="selectIsWorkingCompany('Employee')" :class="[ 'Employee' === salary.employeeType ? 'bg-[#003F72] text-white' : 'bg-white']">Sim</button>
            <button type="button" class="border border-[#D4D2D0] p-3 w-full font-bold text-[#003F72] rounded-r-md"
                    @click="selectIsWorkingCompany('Ex-employee')" :class="[ 'Ex-employee' === salary.employeeType ? 'bg-[#003F72] text-white' : 'bg-white']">Não</button>
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
            <div class="w-full" v-if="salary.employeeType === 'Ex-employee'">
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
