<template>
  <div class="inline-flex flex-row items-end align-bottom">
    <StarRate
      v-for="item in numFullStars"
      :key="'full-' + item"
      class="icon-inline"
    />
    <StarHalf
      v-for="item in numHalfStars"
      :key="'half-' + item"
      class="icon-inline"
    />
    <StarOutline
      v-for="item in numEmptyStars"
      :key="'empty-' + item"
      class="icon-inline"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import StarRate from "client/components/icons/StarRate.vue";
import StarHalf from "client/components/icons/StarHalf.vue";
import StarOutline from "client/components/icons/StarOutline.vue";

export default defineComponent({
  name: "StarRating",
  components: {
    StarRate,
    StarHalf,
    StarOutline,
  },
  props: {
    rating: {
      type: Number,
      required: true,
    },
    maxRating: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const numFullStars = Math.floor(props.rating);
    const numHalfStars = Math.round(props.rating - numFullStars);
    const numEmptyStars = computed(() =>
      Math.max(props.maxRating - numFullStars - numHalfStars, 0)
    );

    return { numFullStars, numHalfStars, numEmptyStars };
  },
});
</script>

<style lang="less" scoped>
.icon-inline {
  top: unset;
}
</style>
