<script setup lang="ts">
import Carousel from "@/components/carousel/Carousel.vue";
import type {Review} from "@/types/Review";
import type {Company} from "@/types/Company";
import formatDate from "@/utils/formatDate";
import router from "@/router";

defineProps<{ reviews: Review[]; }>();

const getDay = (date: any) => {
  return formatDate.getDay(date);
};
const getMonth = (date: any) => {
  return formatDate.getMonth(date);
};
const getYear = (date: any) => {
  return formatDate.getYear(date);
};

const filledStars = (rating: number) => Math.floor(rating ?? 0);
const hasHalfStar = (rating: number) => (rating ?? 0) % 1 >= 0.5;
const emptyStars = (rating: number) => {
  const fillStars = filledStars(rating);
  const halfStar = hasHalfStar(rating) ? 1 : 0;
  return 5 - fillStars - halfStar;
};

const truncateComment = (comment: string) => {
  const words = comment.split(" ");
  if (words.length > 15) {
    return { truncated: words.slice(0, 15).join(" "), isTruncated: true };
  }
  return { truncated: comment, isTruncated: false };
};

const handleReadMore = (reviewId: string | undefined) => {
  window.location.href= `/overview/review/details/${reviewId}`;
};
</script>
<template>
  <Carousel class="md:hidden block" :items="reviews">
    <template class="" v-for="(review, index) in reviews" #[`slide-${index}`]="{ item }">
      <div class="border w-full py-5 h-80 rounded-md px-8 xxs:px-6">
        <div class="flex gap-4">
          <img class="xs:w-8 xs:h-8 w-12 h-12" src="@/assets/img/avatar.jpeg" alt="">
          <div class="">
            <p class="text-[#767676] xxs:text-sm font-bold">{{review.jobTitle}} {{review.employeeType ===  'Ex-employee' ? '(Ex-Funcionário)' : '(Funcionário actual)' }}</p>
            <span class="xxs:text-sm text-md text-[#767676]"> em {{getDay(review.createdAt)}} de {{getMonth(review.createdAt)}} de {{getYear(review.createdAt)}}</span>
          </div>
        </div>
        <div class="flex gap-1 items-center">
          <span class="text-lg font-bold">{{review.score}},0 </span>
          <div class="flex gap-1 items-center">
            <i v-for="n in filledStars(review.score)" :key="'filled-' + n" class="bx bxs-star xxs:text-md text-lg 3xl:text-2xl  text-[#003F72]"></i>
            <i v-if="hasHalfStar((review.score))" class="bx bxs-star-half text-[#003F72] xxs:text-md text-lg  3xl:text-2xl"></i>
            <i v-for="n in emptyStars(review.score)" :key="'empty-' + n" class="bx bx-star xxs:text-md text-lg 3xl:text-2xl text-[#003F72]"></i>
          </div>
        </div>
        <div class="xs:mt-2 mt-4">
          <h3 class="px-2 text-[#2D2D2D] xxs:text-sm xs:text-base text-lg font-bold lg:w-[630px] xl:max-w-[800px]">{{review.reviewTitle}}</h3>
          <div class="w-full px-2">
            <p class="lg:max-w-[60%] xs:text-base max-w-full break-words">{{ truncateComment(review.comment?.comment || "").truncated }}
              <span v-if="truncateComment(review.comment?.comment || '').isTruncated"
                  @click="handleReadMore(review.id)" class="text-[#003f72] underline cursor-pointer">
                saiba mais...
              </span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </Carousel>
</template>

<style scoped>

</style>