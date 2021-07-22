<template>
  <div class="flex flex-col gap-2 p-4 bg-white bg-opacity-50 dark:bg-opacity-5">
    <div class="flex flex-row gap-2 items-center">
      <div class="font-semibold">
        <p>
          <a v-if="url" :href="url" rel="noopener noreferrer" target="_blank">
            <button
              type="button"
              alt="Open in Yelp"
              class="
                p-0
                inline
                text-orange-srk
                dark:text-blue-srk
                opacity-80
                hover:opacity-100
                focus:opacity-100
              "
            >
              <OpenInNew class="text-sm icon-inline" />
            </button>
          </a>
          {{ name }}
          <span class="text-sm opacity-60">{{ price }}</span>
        </p>
      </div>

      <div class="flex-grow" />

      <div v-if="showRemoveButton">
        <ComboButton
          alt="Remove from list"
          class="text-sm bg-red-500 text-white"
          :disabled="isRemoving"
          :loading="isRemoving"
          @click="removeItem"
          ><Delete class="icon-inline"
        /></ComboButton>
      </div>
    </div>

    <div class="dest-thumb flex-shrink-0 relative w-full overflow-hidden">
      <ImageFader
        v-if="image_url"
        :src="image_url"
        class="absolute h-full w-full object-cover"
      />
      <div
        v-else
        class="
          grid grid-cols-1
          place-items-center
          absolute
          h-full
          w-full
          object-cover
          bg-black
          dark:bg-white
          bg-opacity-5
        "
      >
        <p class="opacity-50 uppercase">No image</p>
      </div>
    </div>

    <Drop
      :visible="popupVisible"
      container-class="w-max p-6 drop-bottom drop-right bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg"
      @hide="popupVisible = false"
    >
      <template #default>
        <ComboButton class="p-0" @click="popupVisible = true">
          <OpenStatusIndicator
            v-if="regularHours.length && timezone"
            :time-until-close="timeUntilClose"
          />
          <OpenStatusIndicator
            v-else-if="regularHours.length"
            text-override="Unknown"
            :class-adder-override="['bg-red-900']"
          />
          <OpenStatusIndicator
            v-else
            text-override="No data"
            :class-adder-override="['bg-red-900']"
          />
        </ComboButton>
      </template>
      <template #tooltip>
        <div class="text-sm">
          <p class="font-semibold">Regular hours:</p>
          <YelpHoursDisplay :hours="regularHours" />
        </div>
      </template>
    </Drop>

    <div class="flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="grid grid-cols-1 text-sm gap-2">
        <div>
          <template v-if="display_address">
            <p v-for="(line, index) in display_address" :key="index">
              {{ line }}
            </p>
          </template>
          <p class="text-green-600 dark:text-green-500">
            {{ display_phone }}
          </p>
        </div>

        <div class="text-orange-srk text-xs">
          <StarRating :rating="rating" :max-rating="5" /> ({{
            review_count
          }}
          review{{ review_count === 1 ? "" : "s" }})
        </div>
      </div>
    </div>

    <div class="flex-grow" />
    <div class="opacity-50 text-xs">
      <p :title="lastUpdatedTs">{{ lastUpdatedString }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
} from "@nuxtjs/composition-api";
import Delete from "client/components/icons/Delete.vue";
import OpenInNew from "client/components/icons/OpenInNew.vue";
import timeAgo from "common/utils/timeAgo";
import { format } from "date-fns";

export default defineComponent({
  name: "DestinationItem",
  components: {
    Delete,
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
    timezone: {
      type: String,
      default: null,
    },
    hours: {
      type: Array as PropType<
        {
          is_open_now: boolean;
          hours_type: string; // "REGULAR" is what we want
          open: {
            is_overnight: boolean;
            start: string; // 0000
            end: string; // 0000
            day: number; // 0-6 (Mon - Sun)
          }[];
        }[]
      >,
      required: true,
    },
    special_hours: {
      type: Array as PropType<
        {
          date: string; // yyyy-MM-dd
          is_closed: boolean;
          is_overnight: boolean;
          start: string; // 0000
          end: string; // 0000
        }[]
      >,
      required: true,
    },
    regularHours: {
      type: Array,
      default: () => [],
    },
    timeUntilClose: {
      type: Number,
      default: null,
    },
    lastUpdated: {
      type: Number,
      required: true,
    },
    showRemoveButton: {
      type: Boolean,
      default: false,
    },
    isRemoving: {
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

    const popupVisible = ref<boolean>(false);

    const removeItem = () => {
      emit("pick", props.id);
    };

    return {
      lastUpdatedTs,
      lastUpdatedString,
      removeItem,
      popupVisible,
    };
  },
});
</script>

<style lang="less" scoped>
.dest-thumb {
  aspect-ratio: 1 / 1;
}
</style>
