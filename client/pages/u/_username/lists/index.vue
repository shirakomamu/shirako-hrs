<template>
  <div class="space-y-8">
    <div class="flex flex-row gap-4 items-end">
      <h5 class="text-4xl dark:text-white">{{ title }}</h5>
      <div class="flex-grow" />
      <nuxt-link v-if="mode === 'me'" :to="`/u/${username}/lists/new`" custom>
        <ComboButton
          alt="New list"
          class="text-sm border border-blue-srk text-blue-srk"
        >
          <PlaylistAdd class="icon-inline" /> New list</ComboButton
        >
      </nuxt-link>
    </div>
    <div
      class="
        grid grid-flow-row grid-cols-2
        md:grid-cols-4
        lg:grid-cols-6
        xl:grid-cols-8
        gap-4
        items-center
      "
    >
      <DestinationListAvatar
        v-for="(name, index) in listNameTest"
        :key="index"
        :list-name="name"
        :owner="index.toString()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useMeta,
  useRoute,
} from "@nuxtjs/composition-api";
import PlaylistAdd from "client/components/icons/PlaylistAdd.vue";
import useUser from "client/composables/useUser";

export default defineComponent({
  components: {
    PlaylistAdd,
  },
  setup() {
    const context = useContext();
    const route = useRoute().value;
    const user = useUser();

    const { username } = route.params;

    const mode = ref<string>("other");
    const title = ref<string>(`${username}'s lists`);
    if (user.value?.username === username) {
      mode.value = "me";
      title.value = "My lists";
    }

    const listNameTest = [
      "Hello there",
      "My name is",
      "Shirako",
      "Mamu",
      "Favorites",
      "Hello there",
      "My name is",
      "Shirako",
      "Mamu",
      "Favorites",
      "Hello there",
      "My name is",
      "Shirako",
      "Mamu",
      "Favorites",
      "Hello there",
      "My name is",
      "Shirako",
      "Mamu",
      "Favorites",
    ];

    useMeta({ title: `${title.value} | ` + context.$config.appinfo.name });
    return { listNameTest, username, mode, title };
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped></style>
