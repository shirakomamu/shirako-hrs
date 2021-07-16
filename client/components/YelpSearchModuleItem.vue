<template>
  <div class="grid grid-cols-1 gap-2">
    <div class="flex flex-row gap-2 items-center">
      <div class="font-semibold">
        <p>
          {{ name }}
          <span class="text-sm opacity-60">{{ price }}</span>
        </p>
      </div>
      <a v-if="url" :href="url" rel="noopener noreferrer" target="_blank">
        <button
          type="button"
          alt="Open in Yelp"
          class="
            p-0
            text-blue-srk
            opacity-80
            hover:opacity-100
            focus:opacity-100
          "
        >
          <OpenInNew class="text-sm icon-inline" />
        </button>
      </a>
    </div>

    <div class="grid grid-cols-1 text-sm">
      <template v-if="display_address">
        <p v-for="(line, index) in display_address" :key="index">{{ line }}</p>
      </template>
      <p class="text-green-600 dark:text-green-500">{{ display_phone }}</p>
    </div>

    <div class="grid grid-cols-1 text-xs">
      <p class="text-orange-srk">
        <StarRating :rating="rating" :max-rating="5" /> ({{
          review_count
        }}
        review{{ review_count === 1 ? "" : "s" }})
      </p>
    </div>

    <div class="grid grid-cols-1 opacity-50 text-xs">
      <p>Hours last updated: {{ lastUpdatedString }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropOptions } from "@nuxtjs/composition-api";
import { format } from "date-fns";
import OpenInNew from "client/components/icons/OpenInNew.vue";

export default defineComponent({
  name: "YelpSearchModuleItem",
  components: {
    OpenInNew,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review_count: {
      type: Number,
      required: true,
    },
    display_address: {
      type: Array,
      required: true,
    } as PropOptions<string[]>,
    display_phone: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const lastUpdatedString =
      props.lastUpdated > 0
        ? format(props.lastUpdated, "yyyy-MM-dd HH:mm")
        : "never";

    return { lastUpdatedString };
  },
});
</script>

<style lang="less" scoped></style>
