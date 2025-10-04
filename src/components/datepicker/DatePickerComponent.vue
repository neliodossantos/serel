<script setup lang="ts">
import {ref, computed, watch} from 'vue';

const emit = defineEmits(['update:modelValue', 'dateSelect']);
const props = defineProps<{
  modelValue: Date | null;
  placeholder?: string;
}>();

const currentDate = ref(props.modelValue || new Date());
const showCalendar = ref(false);
const inputValue = ref(props.modelValue ? props.modelValue.toLocaleDateString('pt-BR') : '');
const showYearSelector = ref(false);

const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const yearsRange = computed(() => {
  const currentYearInt = currentYear.value;
  const years = [];
  // Mostrar 10 anos para trás e 10 para frente
  for (let i = currentYearInt - 10; i <= currentYearInt + 10; i++) {
    years.push(i);
  }
  return years;
});

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay();
});

const days = computed(() => {
  const days = [];
  const totalDays = daysInMonth.value;
  const firstDay = firstDayOfMonth.value;

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return days;
});

const validateDate = (dateStr: string): boolean => {
  // Verifica se o formato é DD/MM/YYYY
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateStr)) return false;

  const [, day, month, year] = dateStr.match(regex) || [];
  const numDay = parseInt(day, 10);
  const numMonth = parseInt(month, 10) - 1; // Mês começa em 0
  const numYear = parseInt(year, 10);

  // Verifica se a data é válida
  const date = new Date(numYear, numMonth, numDay);
  return date.getDate() === numDay &&
      date.getMonth() === numMonth &&
      date.getFullYear() === numYear;
};

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  inputValue.value = value;

  // Atualiza apenas se a data for válida
  if (validateDate(value)) {
    const [day, month, year] = value.split('/').map(Number);
    const newDate = new Date(year, month - 1, day);

    currentDate.value = newDate;
    currentMonth.value = newDate.getMonth();
    currentYear.value = newDate.getFullYear();
    emit('update:modelValue', newDate);
    emit('dateSelect', newDate);
    showCalendar.value = false; // Fecha o calendário quando uma data válida é digitada
  }
};

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const selectDate = (day: number) => {
  if (!day) return;

  const newDate = new Date(currentYear.value, currentMonth.value, day);
  currentDate.value = newDate;
  inputValue.value = newDate.toLocaleDateString('pt-BR');
  emit('update:modelValue', newDate);
  emit('dateSelect', newDate);
  showCalendar.value = false;
};

const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value;
  showYearSelector.value = false;
};

const toggleYearSelector = () => {
  showYearSelector.value = !showYearSelector.value;
};

const selectYear = (year: number) => {
  currentYear.value = year;
  showYearSelector.value = false;
};
</script>

<template>
  <div class="relative">
    <input
        type="text"
        v-model="inputValue"
        :placeholder="placeholder || 'DD/MM/YYYY'"
        @input="handleInput"
        @click="toggleCalendar"
        class="w-full p-3 border border-[#D4D2D0] rounded-lg cursor-pointer"
        maxlength="10"
    />

    <div v-if="showCalendar" class="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-4 w-64">
      <div class="flex justify-between items-center mb-4">
        <button type="button" @click="previousMonth" class="p-1 hover:bg-gray-100 rounded">
          &lt;
        </button>
        <span @click="toggleYearSelector" class="font-semibold cursor-pointer hover:underline">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </span>
        <button type="button" @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
          &gt;
        </button>
      </div>

      <!-- Seletor de Ano -->
      <div v-if="showYearSelector" class="max-h-48 overflow-y-auto">
        <div class="grid grid-cols-3 gap-2">
          <button
              v-for="year in yearsRange"
              :key="year"
              @click="selectYear(year)"
              class="p-2 text-sm hover:bg-blue-100 rounded"
              :class="{'bg-blue-500 text-white hover:bg-blue-600': year === currentYear}"
          >
            {{ year }}
          </button>
        </div>
      </div>

      <!-- Calendário -->
      <div v-else>
        <div class="grid grid-cols-7 gap-1 text-center">
          <div class="text-sm font-medium">D</div>
          <div class="text-sm font-medium">S</div>
          <div class="text-sm font-medium">T</div>
          <div class="text-sm font-medium">Q</div>
          <div class="text-sm font-medium">Q</div>
          <div class="text-sm font-medium">S</div>
          <div class="text-sm font-medium">S</div>

          <template v-for="day in days" :key="day">
            <div
                v-if="day"
                @click="selectDate(day)"
                class="p-1 text-sm hover:bg-blue-100 cursor-pointer rounded"
                :class="{
                'bg-blue-500 text-white hover:bg-blue-600':
                  currentDate &&
                  day === currentDate.getDate() &&
                  currentMonth === currentDate.getMonth() &&
                  currentYear === currentDate.getFullYear()
              }"
            >
              {{ day }}
            </div>
            <div v-else class="p-1"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>