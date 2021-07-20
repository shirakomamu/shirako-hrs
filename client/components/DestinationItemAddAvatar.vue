<template>
  <div
    class="
      container
      grid grid-cols-1
      items-center
      text-center
      p-4
      h-full
      transition
      bg-white bg-opacity-50
      dark:bg-opacity-5
      hover:bg-opacity-70
      dark:hover:bg-opacity-10
    "
  >
    <div class="grid grid-cols-1 gap-2 place-items-center">
      <Add class="icon-inline" />
      <p>Add to list...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Add from "client/components/icons/Add.vue";

export default defineComponent({
  name: "DestinationItemAddAvatar",
  components: {
    Add,
  },
});
</script>

<style lang="less" scoped>
.container {
  position: relative;
}
.icon-inline {
  width: 3rem;
  height: 3rem;
}
</style>
