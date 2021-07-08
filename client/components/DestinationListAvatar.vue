<template>
  <div
    class="
      container
      grid grid-cols-1
      items-center
      bg-blue-srk bg-opacity-10
      transition
      hover:bg-opacity-50
      text-sm text-center text-white
      hover:font-semibold
      rounded-2xl
      p-2
    "
  >
    <!-- <List class="list-icon text-blue-srk" /> -->
    <div class="grid grid-cols-1 gap-2">
      <p>{{ listName }}</p>
      <p class="opacity-50">{{ owner }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
// import List from "client/components/icons/List.vue";

export default defineComponent({
  name: "DestinationListAvatar",
  components: {
    // List,
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
  height: 2rem;
  width: 2rem;
}
</style>
