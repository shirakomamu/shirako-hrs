<template>
  <div class="space-y-4">
    <form class="grid grid-cols-1 gap-4" @submit.prevent="onSearch">
      <div>
        <label :for="termUid">Search term</label>
        <Input
          :id="termUid"
          ref="termInput"
          v-model="term"
          type="text"
          name="searchTerm"
          classes="p-2 text-sm w-full"
          passive-text="Restaurant or food to search for."
          min="1"
          max="64"
          required
          :do-validation="true"
          :disabled="isSearching"
        />
      </div>
      <div>
        <label :for="locationUid">Location</label>
        <Input
          :id="locationUid"
          ref="locationInput"
          v-model="location"
          type="text"
          name="location"
          classes="p-2 text-sm w-full"
          passive-text="Location to search near. You can use an address, ZIP code, or city name."
          min="1"
          max="64"
          required
          :do-validation="true"
          :disabled="isSearching"
        />
      </div>
      <div>
        <ComboButton
          type="submit"
          alt="Search"
          class="text-sm border w-full"
          :loading="isSearching"
          :disabled="isSearching"
          ><IconsSearch class="icon-inline" /> Search</ComboButton
        >
      </div>
      <div class="flex flex-row justify-end">
        <a
          class="flex flex-row items-center gap-1"
          href="https://yelp.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p class="text-xs">data provided by</p>
          <img class="yelp-icon" alt="Yelp logo" width="48" />
        </a>
      </div>
    </form>
    <div v-if="searchResults.total >= 0" class="grid grid-cols-1 gap-4">
      <div
        v-for="(item, index) in searchResults.items"
        :key="index"
        class="p-4 bg-white bg-white/50 dark:bg-white/5"
      >
        <YelpSearchModuleItem
          :id="item.id"
          :name="item.name"
          :image_url="item.image_url"
          :url="item.url"
          :price="item.price"
          :rating="item.rating"
          :review_count="item.review_count"
          :display_address="item.display_address"
          :display_phone="item.display_phone"
          :last-updated="item.lastUpdated"
          :show-add-button="!!managedList"
          :is-adding="loadingIds.includes(item.id)"
          :is-added="addedIds.includes(item.id)"
          :disabled="disableAdd"
          @pick="onSelect"
        />
      </div>

      <div v-if="searchResults.total === 0">
        <hr class="mb-4" />
        <p>No results were found.</p>
        <hr class="mt-4" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  useStore,
} from "@nuxtjs/composition-api";
import useInternalApi from "client/composables/useInternalApi";
import useSelf from "client/composables/useSelf";
import { BusinessSearchDto } from "common/dto/items";
import Input from "client/components/Input.vue";
import uniqueId from "common/utils/uniqueId";
import { DestinationListModel } from "client/models";
import { Item } from "@vuex-orm/core";
import { IDestinationSearchPayload } from "common/types/api/items";

export default defineComponent({
  name: "YelpSearchModule",
  props: {
    managedList: {
      type: Object as PropType<Item<DestinationListModel> | null>,
      default: null,
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const self = useSelf();
    const api = useInternalApi();
    const store = useStore();
    const model = store.$db().model(DestinationListModel);

    // refs
    const termInput = ref<null | InstanceType<typeof Input>>(null);
    const locationInput = ref<null | InstanceType<typeof Input>>(null);
    const loadingIds = ref<string[]>([]);
    const addedIds = computed(() => {
      if (!props.managedList) {
        return [];
      }
      return props.managedList.items.map((e) => e.id);
    });

    const onSelect = async (destinationId: string) => {
      if (!props.managedList) {
        return emit("pick", ...arguments);
      }

      loadingIds.value.push(destinationId);
      await model.apiAddItemToList({
        id: props.managedList.id,
        username: props.managedList.owner,
        destinationId,
      });
      loadingIds.value = loadingIds.value.filter((e) => e !== destinationId);
    };

    const uid = uniqueId();
    const termUid = "term-" + uid;
    const locationUid = "location-" + uid;

    // data
    const isSearching = ref<boolean>(false);
    const searchResults = ref<IDestinationSearchPayload>({
      total: -1,
      items: [],
    });
    const term = ref<null | string>("restaurants");
    const location = ref<null | string>(
      self.value?.meta.locationSettings?.defaultLocation || null
    );

    const onSearch = async () => {
      if (!term.value || !location.value) return;

      isSearching.value = true;
      const response = await api<IDestinationSearchPayload>({
        method: "post",
        url: "/api/items/search",
        data: {
          location: location.value,
          term: term.value,
        } as BusinessSearchDto,
      });
      isSearching.value = false;

      if (response.ok) {
        searchResults.value = response.payload;
      }
    };

    const focus = () => termInput.value?.focus();

    return {
      emit,

      termInput,
      locationInput,
      loadingIds,
      addedIds,

      termUid,
      locationUid,

      isSearching,
      searchResults,
      term,
      location,

      onSearch,
      onSelect,
      focus,
    };
  },
});
</script>

<style lang="less" scoped>
.yelp-icon {
  content: url("client/assets/vendor/yelp/logo_light.png");

  @media (prefers-color-scheme: dark) {
    content: url("client/assets/vendor/yelp/logo_dark.png");
  }
}
</style>
