<script setup lang="ts">
import {formatNumberInFull, formatSalary} from "@/utils/formatCurrency";
import type {Position} from "@/types/Position";
import {reactive, ref} from "vue";
import {useCurrencyStore} from "@/stores/currency";

const props = defineProps<{ position : Position }>();
const showDropdownCurrency = ref(false);

interface Currency {
  code: string;
  label: string;
  simbol: string;
}

const currentCurrency = reactive<Currency>({
  code: 'AOA',
  label: 'AOA',
  simbol: 'Kz'
});

const currencyStore = useCurrencyStore();

const convertedSalary = ref({
  lowestSalary: props.position.salary.lowestSalary,
  average: props.position.salary.average || 0,
  highestSalary: props.position.salary.highestSalary
});


const currencies : Currency[] = [
  { code: 'AOA', label: 'AOA' , simbol : 'Kz' },
  { code: 'EUR', label: 'EUR' , simbol : '€' },
  { code: 'USD', label: 'USD' , simbol: '$' },
];

async function selectCurrency(code: string) {
  try {
    
    const lowest = await currencyStore.convertCurrency(props.position.salary.lowestSalary , convertedSalary.value.lowestSalary, currentCurrency.code, code);
    const average = await currencyStore.convertCurrency(props.position.salary.average || 0, convertedSalary.value.average , currentCurrency.code, code);
    const highest = await currencyStore.convertCurrency(props.position.salary.highestSalary, convertedSalary.value.highestSalary, currentCurrency.code, code);

    if(lowest.value && average.value && highest.value){
      convertedSalary.value.lowestSalary = lowest.value;
      convertedSalary.value.average = average.value;
      convertedSalary.value.highestSalary = highest.value;
    }

    Object.assign(currentCurrency,currencies.find(currency => currency.code === code));
    showDropdownCurrency.value = false;
  }catch (e) {
    console.log(e);
  }
}
</script>
<template>
  <div class="border shadow px-8 py-5 rounded mt-3">
    <p class="text-[#595959] font-bold dark:text-gray-200">{{ position.title }}</p>
    <div class="">
      <div class="flex justify-between items-center flex-wrap xs:mb-1">
        <div class="">
          <p class="font-light text-sm flex items-center gap-2 dark:text-white">
            <i class='bx bx-money dark:text-white' ></i>
            Intervalo Salarial
          </p>
        </div>
        <div class="flex justify-between gap-2 items-center">
          <i class='bx bx-coin text-2xl dark:text-white'></i>
          <div class="relative">
            <button
                @click="showDropdownCurrency = !showDropdownCurrency"
                class="w-full flex items-center justify-between p-2 rounded-lg text-black
                         focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent border-2">
              <div class="flex items-center gap-2">
                <span class="inline text-sm md:text-base dark:text-white">{{ currentCurrency.code }}</span>
              </div>
              <svg class="w-4 h-4 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul v-if="showDropdownCurrency"
                class="absolute left-0 z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              <li
                  v-for="currency in currencies"
                  :key="currency.code"
                  @click="selectCurrency(currency.code)"
                  class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 hover:rounded-lg cursor-pointer dark:text-white">
                <span class="text-sm md:text-base dark:text-white">{{ currency.label }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="">
        <div class="">
          <div class="flex justify-between gap-3 xs:gap-0 xs:pb-1 flex-wrap">
            <div class="flex items-center gap-1">
              <i class='bx bx-down-arrow-alt text-red-500 text-lg' ></i>
              <p class="font-bold xl:text-lg dark:text-white"> {{currentCurrency.simbol}} {{ formatSalary(convertedSalary.highestSalary ? convertedSalary.highestSalary : 0,
                  { decimalPlaces: 3, currency: true, decimal: true}) }}</p>
            </div>
            <span class="font-bold xl:text-lg 2xl:inline hidden dark:text-white">-</span>
            <div class="flex items-center gap-1 dark:text-white">
              <i class='bx bx-up-arrow-alt text-green-500 text-lg'></i>
              <p class="font-bold xl:text-lg"> {{currentCurrency.simbol}} {{ formatSalary(convertedSalary.highestSalary ? convertedSalary.highestSalary : 0,
                  { decimalPlaces: 3, currency: true, decimal: true}) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between flex-wrap border-t-2 pt-2 mt-2 items-center">
      <div class="">
        <p class="text-sm underline mr-2 dark:text-white">Salario Médio</p>
        <p class="font-bold text-md dark:text-white"> {{currentCurrency.simbol}} {{ formatSalary(convertedSalary.average ? convertedSalary.average : 0,
            { decimalPlaces: 3, currency: true, decimal: true}) }}</p>
      </div>
      <p class="bg-gray-200 py-1 px-2 rounded-xl text-sm inline-block mt-2">{{ position.salary.numberOfReviews }} salarios reportados </p>

    </div>
    <div class="flex justify-end">
    </div>
  </div>
</template>
<style scoped>
</style>