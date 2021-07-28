<template>
  <div class="inline">
    <ImageFader
      v-if="rating === 5"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_5@3x.png"
    />
    <ImageFader
      v-else-if="rating === 4.5"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_4_half@3x.png"
    />
    <ImageFader
      v-else-if="rating === 4"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_4@3x.png"
    />
    <ImageFader
      v-else-if="rating === 3.5"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_3_half@3x.png"
    />
    <ImageFader
      v-else-if="rating === 3"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_3@3x.png"
    />
    <ImageFader
      v-else-if="rating === 2.5"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_2_half@3x.png"
    />
    <ImageFader
      v-else-if="rating === 2"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_2@3x.png"
    />
    <ImageFader
      v-else-if="rating === 1.5"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_1_half@3x.png"
    />
    <ImageFader
      v-else-if="rating === 1"
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_1@3x.png"
    />
    <ImageFader
      v-else
      class="inline h-4"
      src="@/assets/vendor/yelp/stars/regular_0@3x.png"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "StarRating",
  props: {
    rating: {
      type: Number,
      required: true,
    },
  },
  setup() {
    // const numFullStars = Math.floor(props.rating);
    // const numHalfStars = Math.round(props.rating - numFullStars);
    // const numEmptyStars = computed(() =>
    //   Math.max(props.maxRating - numFullStars - numHalfStars, 0)
    // );
    // return { numFullStars, numHalfStars, numEmptyStars };
  },
});
</script>

<style lang="less" scoped></style>
