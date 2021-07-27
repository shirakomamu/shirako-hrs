<template>
  <div
    class="
      container
      flex flex-col
      items-center
      text-center
      p-2
      transition
      bg-white bg-opacity-50
      hover:bg-opacity-70
      dark:(bg-opacity-5
      hover:bg-opacity-10)
      h-full
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
