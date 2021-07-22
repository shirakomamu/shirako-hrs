<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">Dashboard</h5>
    <div
      class="
        grid grid-cols-1
        md:grid-cols-2
        bg-gray-200
        dark:bg-gray-700
        p-8
        gap-4
      "
    >
      <div class="flex flex-col gap-4 col-container-grid">
        <Drop
          :visible="hasSearched && showSearchTooltip"
          container-class="w-full p-2 drop-bottom drop-right bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg"
          max-width="100%"
          @hide="showSearchTooltip = false"
        >
          <template #default>
            <div>
              <label :for="termUid">Search...</label>
              <Input
                :id="termUid"
                ref="termInput"
                v-model="term"
                type="text"
                name="searchTerm"
                classes="p-2 text-sm w-full"
                passive-text="Search by list name, description, or username."
                min="1"
                max="64"
                :do-validation="true"
                :disabled="isSearching"
                @indicatorChange="onSearch"
                @click="showSearchTooltip = true"
              />
            </div>
          </template>
          <template #tooltip>
            <div
              class="
                flex-grow
                space-y-2
                px-2
                border-l-4 border-opacity-20 border-black
                dark:border-white
              "
            >
              <p v-if="!availableListSearchResults.length" class="m-2">
                No results found.
              </p>
              <DashboardListChooser
                v-for="(list, index) in availableListSearchResults"
                :key="index"
                :list="list"
                @pick="onPick"
              />
            </div>
            <!-- <div v-else-if="isSearching">
              <Loader class="search-loader icon-inline text-blue-srk" />
            </div> -->
          </template>
        </Drop>
        <p class="text-xl dark:text-white font-semibold">My lists</p>
        <div
          class="
            flex-grow
            space-y-2
            px-2
            overflow-y-scroll
            border-l-4 border-opacity-20 border-black
            dark:border-white
          "
        >
          <Loader
            v-if="isLoading"
            class="text-orange-srk dark:text-blue-srk list-loader"
          />
          <p v-else-if="!unselectedLists.length && !isLoading" class="m-2">
            No lists available.
          </p>
          <DashboardListChooser
            v-for="(list, index) in unselectedLists"
            :key="index"
            :list="list"
            @pick="onPick"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4 col-container-grid">
        <p class="text-xl dark:text-white font-semibold">Selected</p>
        <div
          class="
            flex-grow
            space-y-2
            px-2
            overflow-y-scroll
            border-l-4 border-opacity-20 border-black
            dark:border-white
          "
        >
          <p v-if="!selectedLists.length" class="m-2">
            Select lists to get started.
          </p>
          <DashboardListChooser
            v-for="(list, index) in selectedLists"
            :key="index"
            :list="list"
            :picked="true"
            @pick="onUnpick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Role } from "common/enums/hrbac";
import { Guard } from "common/types/hrbac";
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useMeta,
  useStore,
} from "@nuxtjs/composition-api";
import useSelf from "client/composables/useSelf";
import { DestinationListModel, MemberModel } from "client/models";
import { Item } from "@vuex-orm/core";
import uniqueId from "common/utils/uniqueId";
import Input from "client/components/Input.vue";
import Loader from "client/components/icons/Loader.vue";

export default defineComponent({
  meta: {
    guard: {
      roles: [Role._self_destination_lists],
    } as Guard,
  },
  components: {
    Loader,
  },
  scrolltoTop: true,
  setup() {
    const context = useContext();
    const self = useSelf();
    const store = useStore();
    useMeta({ title: "Dashboard | " + context.$config.appinfo.name });

    const selectedLists = ref<Item<DestinationListModel>[]>([]);
    const selectedListsIds = computed(() =>
      selectedLists.value.map((e) => e?.id || "0")
    );
    const listSearchResults = ref<Item<DestinationListModel>[]>([]);
    const isLoading = ref<boolean>(false);

    const memberModel = store.$db().model(MemberModel);
    const member = computed(() =>
      memberModel
        .query()
        .with(["lists", "lists.items"])
        .find(self.value?.username || "")
    );
    const destinationLists = computed(() => member.value?.lists || []);
    const unselectedLists = computed(() =>
      destinationLists.value.filter(
        (e) => !selectedListsIds.value.includes(e.id)
      )
    );

    onMounted(async () => {
      window.scrollTo(0, 0);
      isLoading.value = true;
      await memberModel.apiFetch(self.value?.username || "");
      isLoading.value = false;
    });

    const listModel = store.$db().model(DestinationListModel);

    const termInput = ref<null | InstanceType<typeof Input>>(null);
    const uid = uniqueId();
    const termUid = "term-" + uid;
    const term = ref<null | string>(null);
    const hasSearched = ref<boolean>(false);
    const isSearching = ref<boolean>(false);
    const showSearchTooltip = ref<boolean>(false);
    const onSearch = async ({
      state,
      value,
    }: {
      state: "success" | "loading" | "failure" | "none";
      value: string;
    }) => {
      if (state !== "success") return;
      if (!value) {
        termInput.value?.setTouched(false);
        return;
      }
      isSearching.value = true;
      listSearchResults.value = await listModel.apiSearch({
        keyword: value,
        pickedIds: selectedListsIds.value,
      });
      isSearching.value = false;
      hasSearched.value = true;
      showSearchTooltip.value = true;
    };
    const availableListSearchResults = computed(() =>
      listSearchResults.value.filter(
        (e) => e && !selectedListsIds.value.includes(e.id)
      )
    );

    const onPick = (id: string) => {
      const list = listModel.query().where("id", id).first();

      if (!list) return;

      if (selectedLists.value.includes(list)) return;
      selectedLists.value.push(list);
    };

    const onUnpick = (id: string) => {
      selectedLists.value = selectedLists.value.filter((e) => e && e.id !== id);
    };

    return {
      member,
      destinationLists,
      selectedLists,
      unselectedLists,
      listSearchResults,
      availableListSearchResults,
      isLoading,

      termInput,
      uid,
      termUid,
      term,
      hasSearched,
      showSearchTooltip,
      isSearching,
      onSearch,

      onPick,
      onUnpick,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.col-container-grid {
  max-height: max(70vh, 600px);
}
.list-loader {
  height: 2rem;
  width: 2rem;
}
</style>
