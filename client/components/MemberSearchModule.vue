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
          passive-text="Search by username or display name."
          min="1"
          max="24"
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
    </form>
    <div v-if="searchResults.total >= 0" class="grid grid-cols-1 gap-4">
      <div v-for="(user, index) in searchResults.users" :key="index">
        <MemberSearchModuleItem
          :username="user.username"
          :nickname="user.nickname"
          :avatar="user.avatar"
          :show-add-button="!!managedList"
          :is-adding="loadingIds.includes(user.username)"
          :is-added="addedIds.includes(user.username)"
          :is-friend="user.friendStatus.status === FriendStatus.confirmed"
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
import Input from "client/components/Input.vue";
import uniqueId from "common/utils/uniqueId";
import { DestinationListModel, MemberModel } from "client/models";
import { Collection, Item } from "@vuex-orm/core";
import { FriendStatus } from "common/enums";

export default defineComponent({
  name: "MemberSearchModule",
  props: {
    managedList: {
      type: Object as PropType<Item<DestinationListModel> | null>,
      default: null,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const memberModel = store.$db().model(MemberModel);
    const listModel = store.$db().model(DestinationListModel);

    // refs
    const termInput = ref<null | InstanceType<typeof Input>>(null);
    const loadingIds = ref<string[]>([]);
    const addedIds = computed(() => {
      if (!props.managedList) {
        return [];
      }
      return props.managedList.users.map((e) => e.username);
    });

    const onSelect = async (username: string) => {
      if (!props.managedList) {
        return emit("pick", ...arguments);
      }

      loadingIds.value.push(username);
      await listModel.apiAddUserToList({
        username: props.managedList.owner,
        id: props.managedList.id,
        targetUsername: username,
      });
      loadingIds.value = loadingIds.value.filter((e) => e !== username);
    };

    const uid = uniqueId();
    const termUid = "term-" + uid;

    // data
    const isSearching = ref<boolean>(false);
    const searchResults = ref<{
      total: number;
      users: Collection<MemberModel>;
    }>({
      total: -1,
      users: [],
    });
    const term = ref<string>("");

    const onSearch = async () => {
      if (!term.value) return;

      isSearching.value = true;
      searchResults.value.users = await memberModel.apiSearch(term.value);
      searchResults.value.total = searchResults.value.users.length;
      isSearching.value = false;
    };

    const focus = () => termInput.value?.focus();

    return {
      emit,

      termInput,
      loadingIds,
      addedIds,

      termUid,

      isSearching,
      searchResults,
      term,
      location,

      onSearch,
      onSelect,
      focus,

      FriendStatus,
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
