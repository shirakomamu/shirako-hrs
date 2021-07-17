<template>
  <div class="space-y-8">
    <template v-if="list">
      <nuxt-link
        class="text-lg text-blue-srk hover:underline focus:underline"
        :to="`/u/${route.params.username}`"
        ><ArrowBack class="icon-inline" /> Back to {{ route.params.username }}'s
        profile</nuxt-link
      >
      <hr />
      <div class="space-x-2">
        <h6 class="text-2xl dark:text-white inline">{{ title }}</h6>
        <ListVisibilityIndicator :visibility="list.visibility" class="inline" />
      </div>
      <p>{{ list.description }}</p>
      <div
        class="
          grid grid-cols-1
          gap-4
          items-center
          bg-gray-200
          dark:bg-gray-700
          p-8
        "
      >
        <Loader v-if="listLoading" class="loading text-blue-srk" />
        <p v-for="(item, index) in list.items" :key="index">{{ item.id }}</p>
      </div>
      <ComboButton @click="showSearchModal = true">Show</ComboButton>
      <YelpSearchModal
        :visible="showSearchModal"
        :managed-list="list"
        @hide="showSearchModal = false"
      />
    </template>
    <template v-else>
      <div class="grid grid-cols-1 place-items-center">
        <Loader class="loading text-blue-srk" /></div
    ></template>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useMeta,
  useRoute,
  useStore,
} from "@nuxtjs/composition-api";
import Loader from "client/components/icons/Loader.vue";
import ArrowBack from "client/components/icons/ArrowBack.vue";
import { DestinationListModel } from "client/models";

export default defineComponent({
  components: {
    ArrowBack,
    Loader,
  },
  setup() {
    const context = useContext();
    const route = useRoute();
    const store = useStore();
    const model = store.$db().model(DestinationListModel);

    // useList({
    //   username: route.value.params.username,
    //   id: route.value.params.listId,
    // });

    onMounted(() =>
      model.apiFetch({
        username: route.value.params.username,
        id: route.value.params.listId,
      })
    );

    const showSearchModal = ref<boolean>(false);

    const list = computed(() =>
      model
        .query()
        .with("items")
        .find([route.value.params.username, route.value.params.listId])
    );

    const listLoading = computed<boolean>(() => model.fetching);

    const title = computed(() => list.value?.name);

    useMeta(() => ({
      title:
        (list.value ? `${list.value.name} | ` : "Loading... | ") +
        context.$config.appinfo.name,
    }));

    return {
      route,
      listLoading,

      showSearchModal,

      list,
      title,
    };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped>
.loading {
  height: 4rem;
  width: 4rem;
}
</style>
