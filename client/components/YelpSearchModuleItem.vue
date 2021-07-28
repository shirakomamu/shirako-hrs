<template>
  <div class="grid grid-cols-1 gap-4">
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
            text-orange-srk
            dark:text-blue-srk
            opacity-80
            hover:opacity-100
            focus:opacity-100
          "
        >
          <IconsOpenInNew class="text-sm icon-inline" />
        </button>
      </a>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 items-center">
      <div
        v-if="image_url"
        class="
          flex-shrink-0
          relative
          w-full
          h-48
          sm:(h-32
          w-32)
          overflow-hidden
        "
      >
        <ImageFader
          :src="image_url"
          class="absolute h-full w-full object-cover"
        />
      </div>
      <div class="w-full flex-grow grid grid-cols-1 gap-2">
        <div class="flex flex-col sm:(flex-row items-center) gap-2">
          <div class="grid grid-cols-1 text-sm">
            <template v-if="display_address">
              <p v-for="(line, index) in display_address" :key="index">
                {{ line }}
              </p>
            </template>
            <p class="text-green-600 dark:text-green-500">
              {{ display_phone }}
            </p>
          </div>

          <div class="flex-grow" />

          <div v-if="showAddButton">
            <ComboButton
              :alt="!isAdded ? 'Add to list' : 'Added'"
              class="w-full sm:w-max text-sm bg-blue-srk text-white"
              :disabled="disabled || isAdded || isAdding"
              :loading="isAdding"
              @click="addItem"
              ><IconsAdd class="icon-inline" />
              {{ !isAdded ? "Add to list" : "Added" }}</ComboButton
            >
          </div>
        </div>

        <div class="text-xs">
          <a :href="url" target="_blank" rel="noopener noreferrer">
            <StarRating :rating="rating" /><span class="opacity-50">
              ({{ review_count }} review{{
                review_count === 1 ? "" : "s"
              }})</span
            >
          </a>
        </div>

        <div class="grid grid-cols-1 opacity-50 text-xs">
          <p :title="lastUpdatedTs">{{ lastUpdatedString }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@nuxtjs/composition-api";
import { format } from "date-fns";
import timeAgo from "common/utils/timeAgo";

export default defineComponent({
  name: "YelpSearchModuleItem",
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      default: null,
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const lastUpdatedTs = computed(() =>
      props.lastUpdated > 0
        ? format(props.lastUpdated, "yyyy-MM-dd HH:mm")
        : "never"
    );
    const lastUpdatedString = computed(() =>
      props.lastUpdated > 0
        ? timeAgo.format(props.lastUpdated, "round-minute")
        : "never"
    );

    const addItem = () => {
      emit("pick", props.id);
    };

    return { lastUpdatedString, lastUpdatedTs, addItem };
  },
});
</script>

<style lang="less" scoped></style>
