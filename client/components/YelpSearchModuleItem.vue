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

    <div class="flex flex-col sm:flex-row sm:items-center gap-2">
      <div class="grid grid-cols-1 text-sm">
        <template v-if="display_address">
          <p v-for="(line, index) in display_address" :key="index">
            {{ line }}
          </p>
        </template>
        <p class="text-green-600 dark:text-green-500">{{ display_phone }}</p>
      </div>

      <div class="flex-grow" />

      <div v-if="showAddButton">
        <ComboButton
          :alt="isAdded ? 'Add to list' : 'Added'"
          class="w-full sm:w-max text-sm bg-blue-srk text-white"
          :disabled="!isAdded || isAdding"
          :loading="isAdding"
          @click="addItem"
          ><Add class="icon-inline" />
          {{ isAdded ? "Add to list" : "Added" }}</ComboButton
        >
      </div>
    </div>

    <div class="grid grid-cols-1 text-xs">
      <div class="text-orange-srk">
        <StarRating :rating="rating" :max-rating="5" /> ({{
          review_count
        }}
        review{{ review_count === 1 ? "" : "s" }})
      </div>
    </div>

    <div class="grid grid-cols-1 opacity-50 text-xs">
      <p>Hours last updated: {{ lastUpdatedString }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@nuxtjs/composition-api";
import { format } from "date-fns";
import OpenInNew from "client/components/icons/OpenInNew.vue";
import Add from "client/components/icons/Add.vue";

export default defineComponent({
  name: "YelpSearchModuleItem",
  components: {
    OpenInNew,
    Add,
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
      type: Array as PropType<string[]>,
      required: true,
    },
    display_phone: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Number,
      required: true,
    },
    showAddButton: {
      type: Boolean,
      default: false,
    },
    isAdded: {
      type: Boolean,
      default: false,
    },
    isAdding: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const lastUpdatedString = computed(() =>
      props.lastUpdated > 0
        ? format(props.lastUpdated, "yyyy-MM-dd HH:mm")
        : "never"
    );

    const addItem = () => {
      emit("pick", props.id);
    };

    return { lastUpdatedString, addItem };
  },
});
</script>

<style lang="less" scoped></style>
