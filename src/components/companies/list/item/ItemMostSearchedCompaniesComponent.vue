<script setup lang="ts">

import {computed} from "vue";

const props = defineProps({
  company : {
    type: Object,
    required : true
  }
});
const emits = defineEmits(['goToOverviewCompany']);

function goToOverviewCompany(id:number){
  emits('goToOverviewCompany',id);
}

const filledStars = computed<number>(() => Math.floor(props.company.rating?.average ?? 0));
const hasHalfStar = computed<boolean>(() => (props.company.rating?.average ?? 0) % 1 >= 0.5);
const emptyStars = computed<number>(() => {
  return 5 - filledStars.value - (hasHalfStar.value ? 1 : 0);
});

</script>
<template>
  <div class="w-full h-full pb-10 border-b-2 sm:border-none sm:pb-0 dark:text-white">
    <div class="flex md:flex-col md:justify-between gap-5 h-full">
      <img @click="goToOverviewCompany(company.id)" :src="company.logo" class="xxs:w-16 xxs:h-16 w-24 h-24 2xl:w-32 2xl:h-32 3xl:w-36 3xl:h-36 hover:cursor-pointer object-cover rounded" alt="">
      <div class="flex flex-col justify-between gap-1 h-full flex-1">
        <div class="max-w-full">
          <h3 class="xs:max-w-36 text-md 3xl:text-lg max-w-44 md:max-w-32 lg:max-w-44 2xl:max-w-48 3xl:max-w-60 hover:underline truncate cursor-pointer" @click="goToOverviewCompany(company.id)">{{company.name}}</h3>
          <span class="flex gap-1 items-center font-light text-sm 3xl:text-base">
            <i class='bx bx-map text-gray-500'></i>{{company.address?.city}} , {{company.address?.country}}
          </span>
          <div class="flex gap-1">
            <i v-for="n in filledStars" :key="'filled-' + n" class="bx bxs-star text-xl 3xl:text-2xl text-[#003F72]"></i>
            <i v-if="hasHalfStar" class="bx bxs-star-half text-xl text-[#003F72] 3xl:text-2xl"></i>
            <i v-for="n in emptyStars" :key="'empty-' + n" class="bx bx-star text-xl 3xl:text-2xl text-[#003F72]"></i>
          </div>
        </div>
        <span class="font-light text-sm 3xl:text-base">{{company.sector}}</span>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>