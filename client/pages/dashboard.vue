<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">Dashboard</h5>
    <div
      class="
        grid grid-cols-1
        sm:grid-cols-2
        bg-gray-200
        dark:bg-gray-700
        p-8
        gap-4
      "
    >
      <div class="grid grid-cols-1 gap-4 col-container-grid">
        <p class="text-xl dark:text-white font-semibold">My lists</p>
        <div
          v-if="unselectedLists && unselectedLists.length"
          class="
            grid grid-cols-1
            gap-2
            px-2
            max-h-96
            overflow-y-scroll
            border-l-4 border-opacity-20 border-black
            dark:border-white
          "
        >
          <DashboardListChooser
            v-for="(list, index) in Array(10).fill(unselectedLists[0])"
            :key="index"
            :list="list"
          />
        </div>

        <div>
          <label :for="termUid">Search...</label>
          <Input
            :id="termUid"
            ref="termInput"
            v-model="term"
            type="text"
            name="searchTerm"
            classes="p-2 text-sm w-full"
            passive-text="Search by list name or description."
            min="1"
            max="64"
            :do-validation="true"
            :disabled="isSearching"
            @indicatorChange="onSearch"
          />
        </div>

        <div
          v-if="unselectedLists && unselectedLists.length"
          class="
            grid grid-cols-1
            gap-2
            px-2
            max-h-64
            overflow-y-scroll
            border-l-4 border-opacity-20 border-black
            dark:border-white
          "
        >
          <DashboardListChooser
            v-for="(list, index) in Array(10).fill(unselectedLists[0])"
            :key="index"
            :list="list"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 col-container-grid">
        <p class="text-xl dark:text-white font-semibold">Selected</p>
        <div
          v-if="unselectedLists && unselectedLists.length"
          class="
            grid grid-cols-1
            gap-2
            px-2
            overflow-y-scroll
            border-l-4 border-opacity-20 border-black
            dark:border-white
          "
        >
          <DashboardListChooser
            v-for="(list, index) in Array(10).fill(unselectedLists[0])"
            :key="index"
            :list="list"
            :picked="true"
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

export default defineComponent({
  meta: {
    guard: {
      roles: [Role._self_destination_lists],
    } as Guard,
  },
  setup() {
    const context = useContext();
    const self = useSelf();
    const store = useStore();
    useMeta({ title: "Dashboard | " + context.$config.appinfo.name });

    const selectedLists = ref<Item<DestinationListModel>[]>([]);
    const selectedListsIds = computed(() =>
      selectedLists.value?.map((e) => e?.id)
    );

    const model = store.$db().model(MemberModel);
    const member = computed(() =>
      model
        .query()
        .with(["lists", "lists.items"])
        .find(self.value?.username || "")
    );
    const destinationLists = computed(() => member.value?.lists);
    const unselectedLists = computed(() =>
      destinationLists.value?.filter(
        (e) => !selectedListsIds.value.includes(e.id)
      )
    );

    onMounted(() => {
      model.apiFetch(self.value?.username || "");
    });

    const termInput = ref<null | InstanceType<typeof Input>>(null);
    const uid = uniqueId();
    const termUid = "term-" + uid;
    const term = ref<null | string>(null);
    const isSearching = ref<boolean>(false);
    const onSearch = ({
      state,
      value,
    }: {
      state: "success" | "loading" | "failure" | "none";
      value: string;
    }) => {
      console.log(state, value);
    };

    return {
      member,
      destinationLists,
      selectedLists,
      unselectedLists,

      termInput,
      uid,
      termUid,
      term,
      isSearching,
      onSearch,
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
</style>
