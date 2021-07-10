<template>
  <div
    class="
      container
      grid grid-cols-1
      items-center
      text-center
      border border-black
      dark:border-white
      border-opacity-20
      hover:border-opacity-100
      p-2
      transition
      filter
      hover:drop-shadow-md
    "
  >
    <List class="list-icon opacity-50" />
    <div class="grid grid-cols-1 gap-2">
      <p class="text-md font-semibold">{{ listName }}</p>
      <p class="text-sm opacity-50">{{ owner }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import List from "client/components/icons/List.vue";

export default defineComponent({
  name: "DestinationListAvatar",
  components: {
    List,
  },
  props: {
    listName: {
      type: String,
      default: "",
    },
    owner: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listName: _listName, owner: _owner } = props;

    return {};
  },
});
</script>

<style lang="less" scoped>
.container {
  aspect-ratio: 1 / 1;
  position: relative;
}
.list-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  height: 1rem;
  width: 1rem;
}
</style>
