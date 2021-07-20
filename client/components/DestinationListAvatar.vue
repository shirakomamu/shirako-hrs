<template>
  <div
    class="
      container
      grid grid-cols-1
      items-center
      text-center
      p-2
      transition
      bg-white bg-opacity-50
      dark:bg-opacity-5
      hover:bg-opacity-70
      dark:hover:bg-opacity-10
    "
  >
    <List class="list-icon opacity-50" />
    <slot />
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
  setup() {
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
  height: 1.5rem;
  width: 1.5rem;
}
</style>
