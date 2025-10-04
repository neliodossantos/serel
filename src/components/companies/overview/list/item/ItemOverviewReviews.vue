<script setup lang="ts">
import type {Review} from "@/types/Review";
import formatDate from "@/utils/formatDate";
import {computed} from "vue";

const props  = defineProps<{ review: Review; }>();
const getDay = computed(() => {
  return formatDate.getDay(props.review.createdAt);
});
const getMonth = computed(() => {
  return formatDate.getMonth(props.review.createdAt);
});
const getYear = computed(() => {
  return formatDate.getYear(props.review.createdAt);
});


const truncateComment = (comment: string) => {
  const words = comment.split(" ");
  if (words.length > 20) {
    return { truncated: words.slice(0, 20).join(" "), isTruncated: true };
  }
  return { truncated: comment, isTruncated: false };
};

const handleReadMore = (reviewId: string | undefined) => {
  window.location.href = `/overview/review/details/${reviewId}`;
};

</script>
<template>
  <div class="mb-16 md:block hidden">
    <div class="flex gap-4">
      <div class="z-10 flex relative items-end justify-center border bg-gray-300 w-10 h-10 md:w-12 md:h-12 rounded-full z-10">
        <i class='z-0 bx bxs-user text-4xl absolute -bottom-2 text-white'></i>
      </div>
      <div class="">
        <p class="text-[#767676] font-bold dark:text-gray-200">{{review.jobTitle}} {{review.employeeType ===  'Ex-employee' ? '(Ex-Funcionário)' : '(Funcionário actual)' }}</p>
        <span class="text-lg font-bold dark:text-gray-200">{{review.score}},0 <i class='bx bxs-star text-[#003F72]' ></i></span>
        <span class="text-md text-[#767676] dark:text-gray-200"> em {{getDay}} de {{getMonth}} de {{getYear}}</span>
      </div>
    </div>
    <div class="mt-4">
      <h3 class="text-[#2D2D2D] text-lg font-bold lg:w-[630px] xl:max-w-[800px] dark:text-gray-200">{{review.reviewTitle}}</h3>
      <div class="w-full">
        <div class="w-full">
          <p class="lg:max-w-[60%] xs:text-base max-w-full break-words dark:text-gray-300">{{ truncateComment(review.comment?.comment || "").truncated }}
            <span v-if="truncateComment(review.comment?.comment || '').isTruncated"
                  @click="handleReadMore(review.id)" class="text-[#003f72] underline cursor-pointer dark:text-blue-500">
                saiba mais...
              </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>