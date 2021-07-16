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
        <p v-for="(item, index) in list.items" :key="index">{{ item.id }}</p>
      </div>
      <ComboButton @click="showSearchModal = true">Show</ComboButton>
      <YelpSearchModal
        :visible="showSearchModal"
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
  ref,
  useContext,
  useMeta,
  useRoute,
  useStore,
  watch,
} from "@nuxtjs/composition-api";
import useList from "client/composables/useList";
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

    const list = useList({
      username: route.value.params.username,
      id: route.value.params.listId,
    });

    const showSearchModal = ref<boolean>(false);

    watch(
      () => route.value.params.username,
      async (value: string) => {
        list.value = null;
        const r = await model.apiFetch({
          username: value,
          id: route.value.params.listId,
        });

        if (!r) {
          return context.error({ statusCode: 404 });
        }

        list.value = r;
      }
    );
    watch(
      () => route.value.params.listId,
      async (value: string) => {
        list.value = null;
        const r = await model.apiFetch({
          username: route.value.params.username,
          id: value,
        });

        if (!r) {
          return context.error({ statusCode: 404 });
        }

        list.value = r;
      }
    );

    const title = computed(() => list.value?.name);

    useMeta(() => ({
      title:
        (list.value ? `${list.value.name} | ` : "Loading... | ") +
        context.$config.appinfo.name,
    }));

    return {
      route,

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
.list-description-form {
  resize: vertical;
}
.loading {
  height: 4rem;
  width: 4rem;
}
</style>
